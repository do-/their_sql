module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_columns: 

    function () {
    
    	const {conf, db: {model}, rq: {type}} = this

		const data = {
		
			_fields: model.getFields (type),
		
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
        
        const filters = []
        
    	if ('id_table' in rq) rq.pre = rq.id_table
        if ('pre' in rq)          filters.push (['id', 'SIMILAR TO', `(${rq.pre}).%`])
        if ('id_ref_table' in rq) filters.push (['id_ref_table', '=', rq.id_ref_table])

		const q = db.w2uiQuery ([['columns_vw', {filters}]], {order: ['id']})

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
    
    	const {db, rq: {type, id}} = this
    	
        const data = await db.getObject (
        	db.model.createQuery ([['columns_vw', {filters: [['id', '=', id]]}]])
        )
    
//        const data = await db.getObject ('SELECT * FROM columns_vw WHERE id = ?', [id])

        data._fields = db.model.getFields (type)
        
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