////////////////////////////////////////////////////////////////////////////////

$_DO.update_table_new = async function (e) {

    let f = w2_popup_form (), {name, note} = f.values ().actual ().validated ()

    let item = await response ({type: 'tables', action: 'clone', id: $_REQUEST.id}, {data: {name, note}})

	w2popup.close ()
		
    w2_confirm_open_tab ('Таблица создана. Открыть её страницу?', '/table/' + name)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.table_new = async function (o) {

	let parts = o.id.split ('.'); parts [0] = 'bf_50'

	o.name = parts.join ('.')

    return o
    
}