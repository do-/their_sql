module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tables: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.tables.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_tables: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "id", direction: "asc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'id',     operator: 'contains', value: q},
                {field: 'pk',     operator: 'is', value: q},
                {field: 'note',   operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        return this.db.add_all_cnt ({}, [{tables_vw: filter}])

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
            
        await db.do ('DELETE FROM columns WHERE id_table = ? AND is_confirmed = 0', [rq.id])
        await db.do ('DELETE FROM tables WHERE id = ? AND is_confirmed = 0', [rq.id])

	},

////////////////////////////////////////////////////////////////////////////////

do_clone_tables: 

    async function () {
    
        let {db, rq} = this, {id, data} = rq, {name, note} = data
        
        let [b, t] = id.split ('.'), new_id = b + '.' + name
        
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