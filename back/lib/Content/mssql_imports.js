module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_item_of_mssql_imports:

    async function () {

        return this.db.get ({imports: this.rq.id})

    },


////////////////////////////////////////////////////////////////////////////////

do_create_mssql_imports:

    async function () {

    	let uuid = this.rq.id

        await this.db.insert_if_absent ('imports', {uuid})

        setImmediate (() => this.conf.response ({type: 'mssql_imports', id: uuid, action: 'execute'}, {}, null, this.user))

        return uuid

    },


////////////////////////////////////////////////////////////////////////////////

do_execute_mssql_imports:

    async function () {

    	let {db, db_nn} = this

    	async function imp (table, cols, sql) {

	    	let tmp = await db.create_temp_as (table, cols)
	    	let str = await db_nn.select_stream (sql)

			await db.load (str, tmp, cols)
console.log (await db.select_all (`SELECT * FROM ${tmp}`))
			await db.do (`
				INSERT INTO ${table} (${cols})
				SELECT ${cols}
				FROM ${tmp}
				ON CONFLICT (id) DO UPDATE SET ${cols.filter (k => k != 'id').map (k => k + '=EXCLUDED.' + k)}
			`)

			await db.do (`UPDATE ${table} SET is_confirmed = 0 WHERE id SIMILAR TO ? AND id NOT IN (SELECT id FROM ${tmp})`, ['(fkr|fkr_rr|mkd_service|fkr_event|fkr_tasks).%'])
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
				t.table_catalog IN ('APP_FOAB')


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
				t.table_catalog IN ('APP_FOAB')


    	`)

    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

    },

}