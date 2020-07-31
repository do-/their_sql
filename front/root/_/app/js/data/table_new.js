////////////////////////////////////////////////////////////////////////////////

$_DO.update_table_new = async function (e) {

    let f = w2_popup_form (), {name, note} = f.values ().actual ().validated ()

    let item = await response ({type: 'tables', action: 'clone', id: $_REQUEST.id}, {data: {name, note}})

	w2popup.close ()
	
	let [b, t] = $_REQUEST.id.split ('.')
	
    w2_confirm_open_tab ('Таблица создана. Открыть её страницу?', '/table/' + b + '.' + name)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.table_new = async function (o) {

	o.name = o.id.split ('.') [1]

    return o
    
}