////////////////////////////////////////////////////////////////////////////////

$_DO.update_set_ref_columns_popup = async function (e) {

	let id_ref_table = e.recid

	if (!confirm (`Вы уверены, что хотите установить ссылку на таблицу ${id_ref_table}?`)) return 
	
	w2utils.lock ($('#w2ui-popup .w2ui-page'))
		
	await Promise.all (w2ui ['columnsGrid'].getSelection ().map (id => 
		response ({type: 'columns', id, action: 'update'}, {data: {id_ref_table}})
	))
	
	w2_close_popup_reload_grid ()

}
 
////////////////////////////////////////////////////////////////////////////////

$_GET.set_ref_columns_popup = async function (o) {

	let grid = w2ui ['columnsGrid']
	
	let {name} = grid.get (grid.getSelection () [0])
            
    return {name}

}