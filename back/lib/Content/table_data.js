module.exports = {
    
////////////////////////////////////////////////////////////////////////////////

select_table_data: 
    
    async function () {
   
        let filter = this.w2ui_filter ()

        let [portion, start] = filter.LIMIT; delete filter.LIMIT

        let {id_table, aaand} = this.rq
        
        let cols = (await this.db.list ({columns: {
        	'id LIKE': id_table + '.%',
        }}))
        
        let [pk] = cols.filter (i => i.is_pk).map (i => i.name)

        let q = `SELECT ${cols.map (i => {let {name} = i; return name + ' ' + name.toLowerCase ()})} FROM ` + id_table + ' WHERE 1=1', p = []
        
        for (let [t, v] of Object.entries (filter)) {

        	if (/\?\%/.test (t)) v += '%'
        	if (/\%\?/.test (t)) v  = '%' + v

        	q += ' AND ' + t.replace ('ILIKE', 'LIKE').replace (/\%/g, '')
        	
        	p.push (v)
        
        }

        if (aaand) for (let [t, v] of Object.entries (aaand)) {

        	q += ' AND ' + t + ' = ?'
        	
        	p.push (v)
        
        }

        if (pk) q += ' ORDER BY ' + pk + ' DESC'

		q += ` LIMIT ${start}, ${portion}`
		
		let all = await this.db_o.select_all (q, p)
		
		for (let i of all) if (!i.uuid) i.uuid = i [pk]

		return {all, cnt: all.length}

    },

}