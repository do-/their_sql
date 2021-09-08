////////////////////////////////////////////////////////////////////////////////

$_DO.set_ref_columns = async function (e) {

	let grid = this.owner
	
	let ids = grid.getSelection ()
	
	let {length} = ids
	
	if (!length) return alert ('Не отмечено ни одно поле')
	
	let cols = ids.map (id => grid.get (id))
	
	for (let col of cols) {
	
		if (col.is_pk) return alert (`Поле ${col.id} является первичным ключом в своей таблице. На всякий случай операция отменена.`)

		if (col.id_ref_table) return alert (`Поле ${col.id} значится ссылкой на таблицу ${col.id_ref_table}. На всякий случай операция отменена.`)
		
	}
	
	if (length > 1) {
	
		let names = {}; for (let col of cols) names [col.name] = 1
		
		if (Object.keys (names).length > 1) return alert ('Отмечены поля с разными именами. На всякий случай операция отменена.')

	}
	
	show_block ('set_ref_columns_popup')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.patch_columns = async function (e) {

    let grid = this, row = grid.get (e.recid), col = grid.columns [e.column]

    let data = {[col.field]: normalizeValue (e.value_new, col.editable.type)}

    grid.lock ()

    await response ({type: 'columns', id: row.id, action: 'update'}, {data})

    grid.unlock ()

    grid.set (e.recid, data)

    grid.refresh ()

}
    
////////////////////////////////////////////////////////////////////////////////

$_GET.columns = async function (o) {

    let data = await response ({type: 'columns', part: 'vocs'})
    
    data.src [0].checked = true

    add_vocabularies (data, {src: {}})
    
    $('body').data ('data', data)
            
    return data

}