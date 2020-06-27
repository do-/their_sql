////////////////////////////////////////////////////////////////////////////////

$_DO.cancel_table = function (e) {
    
    if (confirm ('Отменить несохранённые правки?')) w2_panel_form ().reload_block ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_table = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.pass_table = function (e) {

    show_block ('table_password')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_table = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_panel_form ()
    
    let data = form.values ().actual ().validated ()

    form.lock ()

    await response ({type: 'tables', action: 'update'}, {data})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.table = async function (o) {

    let data = await response ({type: 'tables'})
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}