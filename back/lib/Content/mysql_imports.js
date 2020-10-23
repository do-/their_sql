module.exports = {

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_mysql_imports: 

    async function () {
        
        return this.db.get ({imports: this.rq.id})

    },
    

////////////////////////////////////////////////////////////////////////////////

do_create_mysql_imports:

    async function () {
    
    	let uuid = this.rq.id
            
        await this.db.insert_if_absent ('imports', {uuid})
        
        setImmediate (() => this.conf.response ({type: 'mysql_imports', id: uuid, action: 'execute'}, {}, null, this.user))
        
        return uuid

    },


////////////////////////////////////////////////////////////////////////////////

do_execute_mysql_imports:

    async function () {
    
    	let {db, db_o} = this
    	
    	async function imp (table, cols, sql) {

	    	let tmp = await db.create_temp_as (table, cols)
	    	let str = await db_o.select_stream (sql)
	    	
			await db.load (str, tmp, cols)

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
				CONCAT(t.table_schema, '.', t.table_name) id
				, CASE t.table_type WHEN 'VIEW' THEN 1 ELSE 0 END is_view
				, IFNULL(t.table_rows, 0) cnt
				, CASE t.table_comment WHEN '' THEN NULL ELSE t.table_comment END remark
			FROM
				information_schema.tables t
			WHERE
				t.table_schema IN ('fkr', 'fkr_rr', 'mkd_service', 'fkr_event', 'fkr_tasks')
    	
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
				t.table_schema IN ('fkr', 'fkr_rr', 'mkd_service', 'fkr_event', 'fkr_tasks')
    	
    	`)
    	
    	await db.do ('UPDATE imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

    },

}