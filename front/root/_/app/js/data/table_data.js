////////////////////////////////////////////////////////////////////////////////

$_GET.table_data = async function (o) {

	let data = clone ($('body').data ('data'))
	
	let {id_table, aaand} = o
	
	if (id_table != data.table.id) {
	
		data = await response ({type: 'tables', id: id_table})
		
	    let {columns} = await response ({type: 'columns', id: null}, {id_table, offset: 0, limit: 10000})
	    
	    data.columns = columns

	    data.table = clone (data)
	
	}

	data.src = ['table_data', {id_table, aaand}]
	
	data.sql = 'SELECT * FROM ' + id_table

	if (aaand) data.sql += ' WHERE ' + Object.entries (aaand).map (kv => kv.join (' = ')).join (' AND ')
	
	data.sql += ' ORDER BY ' + data.table.pk + ' DESC LIMIT 100'

    return data

}