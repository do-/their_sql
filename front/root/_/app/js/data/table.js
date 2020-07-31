////////////////////////////////////////////////////////////////////////////////

$_DO.clone_table = function (e) {

	show_block ('table_new', clone ($('body').data ('data')))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.delete_table = async function (e) {

	if (!confirm ('Правда удалить? Совсем?')) return

    await response ({type: 'tables', action: 'delete'})
    
    window.close ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_table = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()
	
	$('button[name=clone]').unbind ('click' ).click ($_DO.clone_table)
	$('button[name=delete]').unbind ('click' ).click ($_DO.delete_table)

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
    
    data.table = clone (data)
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}