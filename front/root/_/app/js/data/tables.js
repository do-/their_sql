////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_kapital_tables = async function () {

	let grid = this.owner
	
	grid.lock ('Обновляем KAPITAL...')
	
	await response ({action: 'reload_kapital'})
	
	grid.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tables = async function (o) {

    let data = await response ({type: 'tables', part: 'vocs'})
    
    add_vocabularies (data, {})
    
    $('body').data ('data', data)
            
    return data

}