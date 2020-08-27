const fs = require ('fs')
const {Readable, Transform, PassThrough} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tables: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.tables.columns}, {
        	voc_table_status: {},
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_tables: 
    
    function () {
    
    	let {rq} = this
   
        rq.sort = rq.sort || [{field: "id", direction: "asc"}]

        if (rq.searchLogic == 'OR' && rq.search.length) {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'id',     operator: 'contains', value: q},
                {field: 'pk',     operator: 'is', value: q},
                {field: 'note',   operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        let {pre} = rq; if (pre) filter ['id SIMILAR TO ?'] = `(${pre}).%`
        
        return this.db.add_all_cnt ({}, [{'tables_vw(*, id_status AS _status)': filter}])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_tables: 

    async function () {
    
    	let {id} = this.rq

        let data = await this.db.get ([{tables_vw: {id}}])

        data._fields = this.db.model.tables.tables.columns
        
        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

do_reload_oviont_tables: 

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

			await db.do (`UPDATE ${table} SET is_confirmed = 0 WHERE id SIMILAR TO ? AND id NOT IN (SELECT id FROM ${tmp})`, ['(fkr|fkr_rr|mkd_service).%'])
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
				t.table_schema IN ('fkr', 'fkr_rr', 'mkd_service')
    	
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
				t.table_schema IN ('fkr', 'fkr_rr', 'mkd_service')
    	
    	`)

    },

////////////////////////////////////////////////////////////////////////////////

do_reload_kapital_tables: 

    async function () {
    
    	let n2s = {}, root = '../../../kapital/', js = 'back.js/lib/Model/kapital/', pm = 'back/lib/Model/' //root = '../../../kapital/back.js/lib/Model/kapital/'
    	
		for (let fn of fs.readdirSync (root + pm)) {
		
			let n = fn.replace ('.pm', '')
			
			n2s ['k.' + n] = pm + fn

		}

    	for (let dir of fs.readdirSync (root + js)) {

			for (let fn of fs.readdirSync (root + js + dir)) {
			
				let n = fn.replace ('.js', '')
				
				if (/\./.test (n)) continue

				n2s ['k.' + n] = js + dir + '/' + fn

			}

    	}

        await this.db.do ('SELECT copy_from_kapital()')
        
        await this.db.do ('UPDATE tables SET path = NULL WHERE id LIKE ?', ['k.%'])
        
		return Promise.all (Object.entries (n2s).map (ns => 
		
			this.db.do ('UPDATE tables SET path = ? WHERE id = ?', ns.reverse ())
		
		))

	},

////////////////////////////////////////////////////////////////////////////////
	
do_update_tables: 
	
	    async function () {
	    
	        let {id, data} = this.rq
	        
	        data.id = id
	        
	        await this.db.update ('tables', data)
	
		},
	
////////////////////////////////////////////////////////////////////////////////

do_delete_tables: 

    async function () {
    
    	let {db, rq} = this
            
        await db.do ('DELETE FROM columns WHERE id_table IN (SELECT id FROM tables_vw WHERE id = ? AND id_status > 0)', [rq.id])
        await db.do ('DELETE FROM tables WHERE id IN (SELECT id FROM tables_vw WHERE id = ? AND id_status > 0)', [rq.id])

	},

////////////////////////////////////////////////////////////////////////////////

do_clone_tables: 

    async function () {
    
        let {db, rq} = this, {id, data} = rq, {name, note} = data, new_id = name

        try {

            await db.do (`
		    
		    	INSERT INTO tables (
					id,
					is_view,
					cnt,
					note,
					is_confirmed
		    	)
		    	SELECT
					? id, 
					is_view,
					0 cnt, 
					? note, 
					0 is_confirmed 
		    	FROM
		    		tables
		    	WHERE
		    		id = ?
		    
		    `, [new_id, note, id])

        }
        catch (e) {
        
        	throw !db.is_pk_violation (e) ? e : '#name#: Таблица с таким именем уже существует'
        
        }

        return db.do (`
		
			INSERT INTO columns (
				id           , 
				is_pk        ,  
				type         , 
				remark       , 
				note         , 
				id_ref_table , 
				is_confirmed 
			)
			SELECT
				? || name  id, 
				0 is_pk      ,  
				type         , 
				remark       , 
				note         , 
				id_ref_table , 
				0 is_confirmed 
			FROM
				columns
			WHERE
				id_table = ?
		
		`, [new_id + '.', id])
        
	},

}