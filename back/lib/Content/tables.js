const fs = require ('fs')
const {Readable, Transform, PassThrough} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tables: 

    function () {

    	const {conf, db: {model}} = this

		const _fields = {}; for (const {name, type, comment} of Object.values (model.map.get ('tables').columns)) 

			_fields [name] = {name, "REMARK": comment, "TYPE_NAME": type}

		const data = {
		
			_fields,
		
			src: conf.src.map (({id, label}) => ({id, label})),
		
		}
		
		for (const k of ['voc_table_status']) data [k] = model.map.get (k).data

		return data

/*    
return {"_fields":{"id":{"REMARK":"Имя","NULLABLE":false,"TYPE_NAME":"TEXT","name":"id","TYPE_NAME_ORIGINAL":"string"},"is_view":{"REMARK":"1, если VIEW","NULLABLE":false,"COLUMN_DEF":"0","TYPE_NAME":"INT4","name":"is_view","TYPE_NAME_ORIGINAL":"int"},"cnt":{"REMARK":"Число записей","NULLABLE":true,"TYPE_NAME":"INT4","name":"cnt","TYPE_NAME_ORIGINAL":"int"},"remark":{"REMARK":"Их комментарий","NULLABLE":true,"TYPE_NAME":"TEXT","name":"remark","TYPE_NAME_ORIGINAL":"string"},"note":{"REMARK":"Наш комментарий","NULLABLE":true,"TYPE_NAME":"TEXT","name":"note","TYPE_NAME_ORIGINAL":"string"},"is_confirmed":{"REMARK":"1, если есть в БД","NULLABLE":false,"COLUMN_DEF":"0","TYPE_NAME":"INT4","name":"is_confirmed","TYPE_NAME_ORIGINAL":"int"},"path":{"REMARK":"Путь файла-описания в Model","NULLABLE":true,"TYPE_NAME":"TEXT","name":"path","TYPE_NAME_ORIGINAL":"string"},"id_import":{"REMARK":"Последний импорт","NULLABLE":true,"ref":"imports","name":"id_import","TYPE_NAME":"UUID","TYPE_NAME_ORIGINAL":"UUID"}},"src":[{"id":"bf_50","label":"Биллинг МО"}],"voc_table_status":[{"id":0,"label":"OK"},{"id":1,"label":"Нет в БД"},{"id":2,"label":"Не описана"}]}    

        return db.add_vocabularies ({
        
        	_fields: this.db.model.tables.tables.columns,
        	
        	src: conf.src.map (({id, label}) => ({id, label})),
        	
        }, {

        	voc_table_status: {},

        })
*/
    },
    
////////////////////////////////////////////////////////////////////////////////

select_tables:
    
    async function () {

    	const {db, rq} = this, {offset, limit, sort, pre} = rq

    	let filter = 'true', params = []

    	if (pre) {
			filter += ' AND id SIMILAR TO ?'
			params.push (`(${pre}).%`)
    	}

		const [tables_vw, cnt] = await Promise.all ([

			db.getArray (`SELECT t.* FROM tables_vw t WHERE ${filter} ORDER BY ${(sort || [{field: "id", direction: "asc"}]).map (i => i.field + ' ' + i.direction)}`, params, {limit, offset}),

			db.getScalar (`SELECT COUNT (*) FROM tables WHERE ${filter}`, [...params]),

		])

		for (const r of tables_vw) r._status = r.id_status

    	return {tables_vw, cnt, portion: limit}

/*    
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
*/
    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_tables: 

    async function () {
    
    	let {id} = this.rq, [id_src] = id.split ('.')

    	let src = this.conf.src.find (i => i.id.split ('|').includes (id_src)), {product} = src.pool

        let data = await this.db.get ([{tables_vw: {id}}])
        
        data._fields = this.db.model.tables.tables.columns
        
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