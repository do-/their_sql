module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_columns: 

    function () {
    
    	const {conf, db: {model}} = this

		const _fields = {}; for (const {name, type, comment} of Object.values (model.map.get ('columns').columns)) 

			_fields [name] = {name, "REMARK": comment, "TYPE_NAME": type}

		const data = {
		
			_fields,
		
			src: conf.src.map (({id, label}) => ({id, label})),
		
		}

		return data    

    },
    
////////////////////////////////////////////////////////////////////////////////

select_columns: 
    
    function () {

    	const {db, rq} = this
    	
        if (rq.searchLogic === 'OR') {

            const {value} = rq.search [0]

			rq.search = [
				{field: 'name', operator: 'is', value},
				{field: 'note', operator: 'contains', value},
			]

        }

		const q = db.w2uiQuery (
			[
				['columns_vw', {filters: [
					['id', 'SIMILAR TO', `(${rq.pre}).%`]
				].filter (i => 'pre' in rq)}]
			], 
			{order: ['id']}
		)

		return db.getArray (q)

    },
    
////////////////////////////////////////////////////////////////////////////////

get_versions_of_columns: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "_ts", direction: "desc"}]

        let filter = this.w2ui_filter ()  
        
        filter._id = this.rq._id
        
        return this.db.add_all_cnt ({}, [
        	{'columns_versions': filter},
        	'users ON _id_user'
        ])

    },    

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_columns: 

    async function () {
    
    	let {id} = this.rq

        let data = await this.db.get ([{columns_vw: {id}}])

        data._fields = this.db.model.tables.columns.columns
        
        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

do_update_columns: 

    async function () {
    
        let {id, data} = this.rq
        
        data.id = id
        
        await this.db.update ('columns', data)

	},

////////////////////////////////////////////////////////////////////////////////

do_delete_columns: 

    async function () {
    
    	let {db, rq} = this
            
        await db.do ('DELETE FROM columns WHERE id = ? AND is_confirmed = 0', [rq.id])

	},

////////////////////////////////////////////////////////////////////////////////

do_clone_columns: 

    async function () {
    
        let {db, rq} = this, {id, data} = rq, {name, note} = data
        
        let [b, t, c] = id.split ('.')
        
        try {

            await db.do (`
		    
		    	INSERT INTO columns (
					id           , 
					is_pk        ,  
					type         , 
					note         , 
					id_ref_table , 
					is_confirmed 
		    	)
		    	SELECT
					? id         , 
					0 is_pk      ,  
					type         , 
					? note       , 
					id_ref_table , 
					0 is_confirmed 
		    	FROM
		    		columns
		    	WHERE
		    		id = ?
		    
		    `, [[b, t, name].join ('.'), note, id])

        }
        catch (e) {
        
        	throw !db.is_pk_violation (e) ? e : '#name#: Поле с таким именем уже существует'
        
        }
        
	},

}