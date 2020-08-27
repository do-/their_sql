////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_oviont_tables = async function () {

	let grid = this.owner
	
	grid.lock ('Обновляем fkr...')
	
	let id = new_uuid ()
	
	await response ({type: 'mysql_imports', action: 'create', id}, {})
	
	let t = setInterval (async () => {
	
		let data = await response ({type: 'mysql_imports', id})

		if (!data.is_over) return
		
		grid.reload (clearInterval (t))
	
	}, 1000)

}

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
    
    add_vocabularies (data, {voc_table_status: {}})
    
    $('body').data ('data', data)
            
    return data

}