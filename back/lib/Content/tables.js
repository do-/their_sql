const fs = require ('fs')
const {Readable, Transform, PassThrough} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tables: 

    function () {

    	const {conf, db: {model}, rq: {type}} = this

		const data = {
		
			_fields: model.getFields (type),
		
			src: conf.src.map (({id, label}) => ({id, label})),
		
		}
		
		for (const k of ['voc_table_status']) data [k] = model.map.get (k).data

		return data

    },
    
////////////////////////////////////////////////////////////////////////////////

select_tables:
    
    async function () {

    	const {db, rq} = this
    	
        if (rq.searchLogic === 'OR') {

            const {value} = rq.search [0]

            rq.search = ['id', 'note'].map (field => ({field, operator: 'contains', value}))

        }

		const q = db.w2uiQuery (
			[
				['tables_vw', {filters: [
					['id', 'SIMILAR TO', `(${rq.pre}).%`]
				].filter (i => 'pre' in rq)}]
			], 
			{order: ['id']}
		)

		const list = await db.getArray (q)

		for (const r of list) r._status = r.id_status
		
		return list

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_tables: 

    async function () {
    
    	const {conf: {src}, db, rq: {id, type}} = this, [id_src] = id.split ('.')

    	const {product} = src.find (i => i.id.split ('|').includes (id_src))

        const data = await db.getObject ('tables_vw', id)
        
		data._fields = db.model.getFields (type)

        data.product = product
        
        return data

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