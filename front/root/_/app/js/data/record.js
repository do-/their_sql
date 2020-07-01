////////////////////////////////////////////////////////////////////////////////

$_GET.record = async function (o) {

	let [s, t, id] = $_REQUEST.id.split ('.'), id_table = s + '.' + t

    let table     = await response ({type: 'tables', id: id_table})
    
    let {remark, note} = table; table.label = note || remark

    let {columns} = await response ({type: 'columns', id: null}, {id_table, offset: 0, limit: 10000})

	let {all}     = await response ({type: 'table_data', id: null}, {id_table, offset: 0, limit: 1, search: [{field: table.pk, type: "int", operator: "is", value: id}], searchLogic: "AND"})
	
	let r = {}; for (let [k, v] of Object.entries (all [0])) if (v != null && v != '') r [k] = v
	
	for (let c of columns) {
		c.recid = c.id
		if (c.name in r) c.value = r [c.name]
	}
darn ({columns})	
    let data = {table, id, columns}
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}