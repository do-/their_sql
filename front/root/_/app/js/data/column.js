////////////////////////////////////////////////////////////////////////////////

$_DO.edit_column = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()
	
//	$('button[name=clone]').unbind ('click').click ($_DO.clone_column)
//	$('button[name=delete]').unbind ('click').click ($_DO.delete_column)
	clickOn ($('span[data-text=id_table]'), () => open_tab ('/table/' + $('body').data ('data').id_table))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_column = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_panel_form ()
    
    let data = form.values ().actual ().validated ()

    form.lock ()

    await response ({type: 'columns', action: 'update'}, {data})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.column = async function (o) {

    let data = await response ({type: 'columns'})
    
    data.column = clone (data)
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}