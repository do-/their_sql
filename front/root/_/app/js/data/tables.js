////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_oviont_tables = async function () {

	let grid = this.owner
	
	grid.lock ('Обновляем схемы MySQL...')
	
	await response ({action: 'reload_oviont'})
	
	grid.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_kapital_tables = async function () {

	let grid = this.owner
	
	grid.lock ('Обновляем схему KAPITAL...')
	
	await response ({action: 'reload_kapital'})
	
	grid.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tables = async function (o) {

    let data = await response ({type: 'tables', part: 'vocs'})
    
    add_vocabularies (data, {voc_table_status: {}})
    
    $('body').data ('data', data)
            
    return data

}