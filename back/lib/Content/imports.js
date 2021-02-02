const fs = require ('fs')
const {Readable} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_item_of_imports: 

    async function () {

    	let {db, rq} = this

        return db.get ({imports: rq.id})

    },

////////////////////////////////////////////////////////////////////////////////

do_create_imports:

    async function () {

    	let {conf, db, rq, user} = this, {id, data} = rq, {id_src} = data

    	let src = conf.src.find (i => i.id == id_src); if (!src) throw '#id_src#: Нет такой БД'

    	let db_src = src.pool; if (!db_src) throw '#id_src#: Нет подключения'

        await db.insert_if_absent ('imports', {uuid: id, id_src})

        setImmediate (() => conf.response ({
        	type: 'imports', 
        	id,
        	action: 'execute_' + db_src.product
        }, {data: {id_src}}, {conf, db: conf.pools.db, db_src}, user))

        return id

    },

////////////////////////////////////////////////////////////////////////////////

do_execute_mysql_imports:

    async function () {

    	let {db, db_src, rq} = this, {id, data} = rq, {id_src} = data, schemata = id_src.split ('|').map (i => "'" + i + "'")
    	
    	async function imp (table, cols, sql) {

	    	let tmp = await db.create_temp_as (table, cols)
	    	let str = await db_src.select_stream (sql)
	    	
			await db.load (str, tmp, cols)

			await db.do (`
				INSERT INTO ${table} (${cols}) 
				SELECT ${cols}
				FROM ${tmp}
				ON CONFLICT (id) DO UPDATE SET ${cols.filter (k => k != 'id').map (k => k + '=EXCLUDED.' + k)}
			`)

			await db.do (`UPDATE ${table} SET is_confirmed = 0 WHERE id SIMILAR TO ? AND id NOT IN (SELECT id FROM ${tmp})`, [`(${id_src}).%`])

			await db.do (`UPDATE ${table} SET is_confirmed = 1 WHERE id IN (SELECT id FROM ${tmp})`)

    	}
    	
    	await imp ('tables', ['id', 'is_view', 'cnt', 'remark'], `
    	
			SELECT
				CONCAT(t.table_schema, '.', t.table_name) id
				, CASE t.table_type WHEN 'VIEW' THEN 1 ELSE 0 END is_view
				, IFNULL(t.table_rows, 0) cnt
				, CASE t.table_comment WHEN '' THEN NULL ELSE t.table_comment END remark
			FROM
				information_schema.tables t
			WHERE
				t.table_schema IN (${schemata})
    	
    	`)

    	await imp ('columns', ['id', 'is_pk', 'type', 'remark'], `
    	
			SELECT
				CONCAT(t.table_schema, '.', t.table_name, '.', LOWER(t.column_name)) id
				, CASE t.column_key WHEN 'PRI' THEN 1 ELSE 0 END is_pk
				, t.column_type type
				, CASE t.column_comment WHEN '' THEN NULL ELSE t.column_comment END remark
			FROM
				information_schema.columns t
			WHERE
				t.table_schema IN (${schemata})
    	
    	`)
    	
    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])    	

    },

////////////////////////////////////////////////////////////////////////////////

do_execute_mssql_imports:

    async function () {

    	let {db, db_src, rq} = this, {id, data} = rq, {id_src} = data

    	async function imp (table, cols, sql) {

	    	let tmp = await db.create_temp_as (table, cols)
	    	let str = await db_src.select_stream (sql)

			await db.load (str, tmp, cols)

			await db.do (`
				INSERT INTO ${table} (${cols})
				SELECT ${cols}
				FROM ${tmp}
				ON CONFLICT (id) DO UPDATE SET ${cols.filter (k => k != 'id').map (k => k + '=EXCLUDED.' + k)}
			`)

			await db.do (`UPDATE ${table} SET is_confirmed = 0 WHERE id SIMILAR TO ? AND id NOT IN (SELECT id FROM ${tmp})`, [id_src + '.%'])
			await db.do (`UPDATE ${table} SET is_confirmed = 1 WHERE id IN (SELECT id FROM ${tmp})`)

    	}

    	await imp ('tables', ['id', 'is_view', 'cnt', 'remark'], `

			SELECT
				LOWER(CONCAT(t.table_catalog, '.', t.table_name)) id
				, CASE t.table_type WHEN 'VIEW' THEN 1 ELSE 0 END is_view
				, (select sum([rows]) from sys.partitions where object_id=object_id(CONCAT(t.table_schema, '.', t.table_name)) and index_id in (0,1)) cnt
				, prop.value remark
			FROM
				information_schema.tables t
				LEFT JOIN sys.extended_properties prop
    				ON prop.major_id = object_id(t.table_schema + '.' + t.table_name)
    				AND prop.minor_id = 0
    				AND prop.name = 'MS_Description'
			WHERE
				t.table_catalog = UPPER('${id_src}')

    	`)

    	await imp ('columns', ['id', 'is_pk', 'type', 'remark'], `

			SELECT
				LOWER (CONCAT(t.table_catalog, '.', t.table_name, '.', LOWER(t.column_name))) id
				, CASE WHEN EXISTS (
					SELECT
						K.CONSTRAINT_NAME
					FROM
						INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K
						INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C ON C.TABLE_NAME = K.TABLE_NAME
                                                         AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG
                                                         AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA
                                                         AND C.CONSTRAINT_NAME = K.CONSTRAINT_NAME
														 AND C.CONSTRAINT_TYPE = 'PRIMARY KEY'
					WHERE
						K.TABLE_NAME = t.table_name
                        AND K.CONSTRAINT_CATALOG = t.table_catalog
                        AND K.CONSTRAINT_SCHEMA = t.TABLE_SCHEMA
						AND K.COLUMN_NAME = t.column_name
				) THEN 1 ELSE 0 END is_pk
				, t.data_type type
				, prop.value remark
			FROM
				information_schema.columns t
				LEFT JOIN sys.extended_properties prop
					ON prop.major_id = object_id(t.table_schema + '.' + t.table_name)
					AND prop.minor_id = 0
					AND prop.name = 'MS_Description'
			WHERE
				t.table_catalog = UPPER('${id_src}')

    	`)

    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

	},

////////////////////////////////////////////////////////////////////////////////

do_execute_postgresql_imports:

    async function () {
    
    	let {db, db_src, rq} = this, {id, data} = rq, {id_src} = data
    	
    	async function update (table, cols, sql) {
    	
			let buf = await db.create_temp_as (table, cols)

			await db.load ((await db_src.select_stream (sql)), buf, cols)

			await db.do (`		
				INSERT INTO ${table} (${cols}, id_import)
				SELECT ${cols},	?
				FROM ${buf}
				ON CONFLICT (id) DO UPDATE SET ${cols.map (i => i + '= EXCLUDED.' + i)}, id_import = ?				
			`, [id, id])

			await db.do (`
				UPDATE ${table} SET is_confirmed = CASE WHEN id_import = ? THEN 1 ELSE 0 END 
				WHERE id LIKE '${id_src}.%'
			`, [id])
    	
    	}
    	
    	await update ('tables', ['id', 'is_view', 'cnt', 'remark'], `
    	
			SELECT
				'${id_src}.' || t.relname id
				, CASE WHEN t.relkind = 'v' THEN 1 ELSE 0 END is_view
				, t.reltuples cnt
				, (SELECT description FROM pg_description WHERE objsubid = 0 AND objoid = t.oid) remark
			FROM 
				pg_class t
			WHERE
				t.relkind IN ('r', 'v', 'p')
				AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
				AND t.relname NOT LIKE '%.%'
    	
    	`)
    	
    	await update ('columns', ['id', 'is_pk', 'type', 'remark', 'id_ref_table'], `
    	
			WITH cols AS (

				SELECT             
					'${id_src}.' || pg_class.relname || '.' || pg_attribute.attname id
					, pg_type.typname || 
						CASE atttypid 
						WHEN 1700 THEN CONCAT ('(', ((atttypmod - 4) >> 16) & 65535,',',(atttypmod - 4) & 65535,')')
						ELSE '' 
					  END "type"
					, pg_description.description remark
				FROM 
					pg_namespace
					LEFT JOIN pg_class ON (pg_class.relnamespace = pg_namespace.oid AND pg_class.relkind IN ('r', 'v', 'p'))
					LEFT JOIN pg_attribute ON (pg_attribute.attrelid = pg_class.oid AND pg_attribute.attnum > 0 AND NOT pg_attribute.attisdropped)
					LEFT JOIN pg_type ON pg_attribute.atttypid = pg_type.oid
					LEFT JOIN pg_description ON (pg_description.objoid = pg_attribute.attrelid AND pg_description.objsubid = pg_attribute.attnum)
				WHERE
					pg_namespace.nspname = 'public'
					AND pg_class.relname NOT LIKE '%.%'
			)
			, fk AS (

					SELECT
						'${id_src}.' || tc.table_name || '.' || kcu.column_name id, 
						'${id_src}.' || ccu.table_name AS id_ref_table
					FROM 
						information_schema.table_constraints AS tc 
						JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
						JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
					WHERE 
						tc.constraint_type = 'FOREIGN KEY' 
						AND tc.table_schema = 'public'
			)
			, pk AS (

				SELECT
				  '${id_src}.' || ccu.table_name || '.' || ccu.column_name id, 1 is_pk
				FROM information_schema.table_constraints tc 
				JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
				WHERE constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'

			)
			SELECT 
			  cols.*
			  , (SELECT id_ref_table FROM fk WHERE id = cols.id) id_ref_table
			  , COALESCE ((SELECT is_pk FROM pk WHERE id = cols.id), 0) is_pk
			FROM
			  cols
    	
    	`)
    
    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

    },

}