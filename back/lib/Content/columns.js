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
        
        const q = db.w2uiQuery ([['columns_vw']], {order: ['id']}), {filters} = q.tables [0]

    	if ('id_table' in rq) rq.pre = rq.id_table
    	
		if ('pre' in rq) filters.push ({
			sql: 'id SIMILAR TO ?',
			params: [`(${rq.pre}).%`],
		})
    	
		if ('id_ref_table' in rq) filters.push ({
			sql: 'id_ref_table = ?',
			params: [rq.id_ref_table],
		})

		return db.getArray (q)

    },
    
////////////////////////////////////////////////////////////////////////////////

get_versions_of_columns: 
    
    function () {

    	const {db, rq} = this

		return db.getArray (db.w2uiQuery ([
			['columns_versions', {filters: [['_id', '=', rq._id]]}],
			['users', {on: 'columns_versions._id_user = users.uuid'}],
		], {order: [['_ts', true]]}))

    },    

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_columns: 

    async function () {
    
    	const {db, rq: {type, id}} = this
    	    
		const data = await db.getObject ('columns_vw', id)

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