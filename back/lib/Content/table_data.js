module.exports = {

////////////////////////////////////////////////////////////////////////////////

select_table_data: 

    async function () {

		let {conf, rq} = this, {id_table} = rq, [prefix] = id_table.split ('.')

		return conf.response ({type: 'table_data', part: 'records'}, rq, {

			db: conf.pools.db, 

			db_ext: conf.ext_pools [prefix],

		})

	},

////////////////////////////////////////////////////////////////////////////////

get_records_of_table_data:

    async function () {

        let filter = this.w2ui_filter ()

        let [portion, start] = filter.LIMIT; delete filter.LIMIT

        let {db, db_ext, rq} = this, {product} = db_ext, {id_table, aaand} = rq
        
        let is_mysql = product == 'mysql', quot = is_mysql ? '`' : '"' // "`

        let is_mssql = product == 'mssql'

        let cols = (await db.list ({columns: {
        	'id LIKE': id_table + '.%',
        	is_confirmed: 1,
        }}))

        let [pk] = cols.filter (i => i.is_pk).map (i => i.name)

        let [prefix, table_name] = id_table.split ('.')

        let q = `SELECT ${cols.map (i => {

        	let {name} = i

        	let sql = `${quot}${name}${quot}`

        	let lc = name.toLowerCase (); if (lc != name) sql += ` AS ${quot}${lc}${quot}`

        	return sql

        })} FROM ` + (is_mysql ? id_table : table_name) + ' WHERE 1=1', p = []

        for (let [t, v] of Object.entries (filter)) {

        	if (v === null) {

        		let [name, op] = t.split (' ')

        		let [col] = cols.filter (i => i.name == name)

        		q += ' AND (' + name + ' IS'

        		if (op) q += ' NOT'

        		q += ' NULL'

        		if (/(str|cha|tex)/.test (col.type)) q +=

        			op  ? ` AND ${name} <> '' AND TRIM(${name}) <> ''`
        				: ` OR  ${name}  = ''  OR TRIM(${name})  = ''`

        		q += ')'

        	}
        	else {

				if (/\?\%/.test (t)) v += '%'
				if (/\%\?/.test (t)) v  = '%' + v

				if (is_mysql || is_mssql) t = t.replace ('ILIKE', 'LIKE')

				q += ' AND ' + t.replace (/\%/g, '')

				p.push (v)

        	}

        }

        if (aaand) for (let [t, v] of Object.entries (aaand)) {

        	q += ' AND ' + t + ' = ?'

        	p.push (v)

        }

        if (pk) q += ' ORDER BY ' + pk + ' DESC'

		q += is_mysql ? ` LIMIT ${start}, ${portion}` : is_mssql ? ` OFFSET ${start} ROWS FETCH NEXT ${portion} ROWS ONLY` : ` LIMIT ${portion} OFFSET ${start}`

		let all = await db_ext.select_all (q, p), n = 0

		for (let i of all) if (!i.uuid) i.uuid = pk ? i [pk] : 'X3_' + (n ++)

		return {all, cnt: all.length}

    },

}