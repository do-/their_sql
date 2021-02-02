////////////////////////////////////////////////////////////////////////////////

$_DO.refresh_tables = async function (e) {

	if (!confirm ('Вы уверены, что это необходимо?')) return

	let grid = this.owner

	grid.lock ('Синхронизация...')

	let ti = {type: 'imports', id: new_uuid ()}

	await response ({...ti, action: 'create'}, {data: {id_src: e.target.slice (8)}})

	let t = setInterval (async () => {

		let data = await response (ti)

		if (!data.is_over) return

		grid.reload (clearInterval (t))

	}, 1000)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tables = async function (o) {

    let data = await response ({type: 'tables', part: 'vocs'})
    
    data.src [0].checked = true

    add_vocabularies (data, {
    
    	src: {},
    
    	voc_table_status: {},
    
    })

    $('body').data ('data', data)

    return data

}