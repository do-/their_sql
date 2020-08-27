////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_oviont_tables = async function () {

	if (!confirm ('Вы уверены, что это необходимо?')) return

	let grid = this.owner
	
	grid.lock ('Синхронизация...')
	
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

	if (!confirm ('Вы уверены, что это необходимо?')) return

	let grid = this.owner
	
	grid.lock ('Синхронизация...')
	
	let id = new_uuid ()
	
	await response ({type: 'kapital_imports', action: 'create', id}, {})
	
	let t = setInterval (async () => {
	
		let data = await response ({type: 'kapital_imports', id})

		if (!data.is_over) return
		
		grid.reload (clearInterval (t))
	
	}, 1000)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tables = async function (o) {

    let data = await response ({type: 'tables', part: 'vocs'})
    
    add_vocabularies (data, {voc_table_status: {}})
    
    $('body').data ('data', data)
            
    return data

}