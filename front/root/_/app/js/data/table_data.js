////////////////////////////////////////////////////////////////////////////////

$_GET.table_data = async function (o) {

	let data = clone ($('body').data ('data'))
	
	let {id_table, aaand} = o

	data.src = ['table_data', {id_table, aaand}]
	
	data.sql = 'SELECT * FROM ' + id_table

	if (aaand) data.sql += ' WHERE ' + Object.entries (aaand).map (kv => kv.join (' = ')).join (' AND ')
	
	data.sql += ' ORDER BY ' + data.table.pk + ' DESC LIMIT 100'

    return data

}