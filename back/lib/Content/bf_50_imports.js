const fs = require ('fs')
const {Readable} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_bf_50_imports: 

    async function () {
        
        return this.db.get ({imports: this.rq.id})

    },
    

////////////////////////////////////////////////////////////////////////////////

do_create_bf_50_imports:

    async function () {
    
    	let uuid = this.rq.id
            
        await this.db.insert_if_absent ('imports', {uuid})
        
        setImmediate (() => this.conf.response ({type: 'bf_50_imports', id: uuid, action: 'execute'}, {}, null, this.user))
        
        return uuid

    },


////////////////////////////////////////////////////////////////////////////////

do_execute_bf_50_imports:

    async function () {
    
    	let {db, db_b, rq} = this, {id} = rq
    	
    	async function update (table, cols, sql) {
    	
			let buf = await db.create_temp_as (table, cols)

			await db.load ((await db_b.select_stream (sql)), buf, cols)

			await db.do (`		
				INSERT INTO ${table} (${cols}, id_import)
				SELECT ${cols},	?
				FROM ${buf}
				ON CONFLICT (id) DO UPDATE SET ${cols.map (i => i + '= EXCLUDED.' + i)}, id_import = ?				
			`, [id, id])

			await db.do (`
				UPDATE ${table} SET is_confirmed = CASE WHEN id_import = ? THEN 1 ELSE 0 END 
				WHERE id LIKE 'bf_50.%'
			`, [id])
    	
    	}
    	
    	await update ('tables', ['id', 'is_view', 'cnt', 'remark'], `
    	
			SELECT
				'bf_50.' || t.relname id
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
					'bf_50.' || pg_class.relname || '.' || pg_attribute.attname id
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
						'bf_50.' || tc.table_name || '.' || kcu.column_name id, 
						'bf_50.' || ccu.table_name AS id_ref_table
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
				  'bf_50.' || ccu.table_name || '.' || ccu.column_name id, 1 is_pk
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
    
    	let n2s = {}, root = '../../../bf_50/', js = 'back/lib/Model/bf_50/oltp/'
    	
    	for (let dir of fs.readdirSync (root + js)) {

			for (let fn of fs.readdirSync (root + js + dir)) {
			
				let n = fn.replace ('.js', '')
				
				if (/\./.test (n)) continue

				n2s ['bf_50.' + n] = js + dir + '/' + fn

			}

    	}
    	        
		let cols = ['id', 'path']

		let tmp = await db.create_temp_as ('tables', cols)
	    	
		await db.load (Readable.from (Object.entries (n2s).map (([id, path]) => ({id, path}))), tmp, cols)

		await Promise.all ([
		
			...[

				`UPDATE tables t SET path = b.path FROM ${tmp} b WHERE t.id = b.id`,

				`UPDATE tables   SET path = NULL                 WHERE id NOT IN (SELECT id FROM ${tmp})`,

			].map (sql => db.do (sql))
				
		])				

    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

    },

}