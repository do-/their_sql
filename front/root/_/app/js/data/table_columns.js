////////////////////////////////////////////////////////////////////////////////

$_DO.html_table_columns = async function (e) {
		
	let grid = this.owner

	let ids = grid.getSelection ()
	
	if (!ids.length) ids = grid.records.map (i => i.id)
	
	show_block ('columns_html', clone (ids.map (id => grid.get (id))))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.dump_table_columns = async function (e) {

	let grid = this.owner
	
	let ids = grid.getSelection ()
	
	if (!ids.length) ids = grid.records.filter (i => i.is_confirmed == 0).map (i => i.id)
	
	if (!ids.length) return alert ('Непонятно, какие нужны поля: новых нет и явно ни одно не отмечено')
	
	show_block ('columns_dump', clone (ids.map (id => grid.get (id))))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.delete_table_columns = async function (e) {

	e.preventDefault ()

	let ids = this.getSelection ()

	for (let id of ids) {

		let r = this.get (id)

		if (r.is_confirmed == 1) die ('foo', 'Поле ' + r.name + ' уже есть в БД: его удалять нельзя') 

	}
	
	if (!confirm ('Правда удалить? Совсем?')) return

	this.lock ()

	await Promise.all (ids.map (id => response ({type: 'columns', id, action: 'delete'})))

	this.unlock ()
	this.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.clone_table_columns = async function (e) {

	show_block ('column_new', this.get (e.recid))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.drop_fk_table_columns = async function (e) {

	let id = e.recid

	if (!this.get (id). id_ref_table) return

	if (!confirm ('Вы действительно хотите удалить ссылку с этого поля?')) return
	
	this.lock ()
		
	await response ({type: 'columns', id, action: 'update'}, {data: {id_ref_table: ''}})

	this.unlock ()
	this.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.set_pk_table_columns = async function (e) {

	let grid = this

	let {id, name, is_pk} = grid.get (e.recid)
	
	if (is_pk) {

		if (!confirm (`Вы уверены, что ${name} НЕ является первичным ключом этой таблицы?`)) return
		
	}
	else {

		let [c] = grid.records.filter (i => i.is_pk)

		if (c) return alert (`В настоящее время в первичным ключом этой таблицы считается ${c.name}`)

		if (!confirm (`Вы уверены, что ${name} - первичный ключ этой таблицы?`)) return
		
	}
	
	await response ({type: 'columns', id, action: 'update'}, {data: {is_pk: 1 - is_pk}})
	
	show_block ('table_columns')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.patch_table_columns = async function (e) {

    let grid = this, row = grid.get (e.recid), col = grid.columns [e.column]

    let data = {[col.field]: normalizeValue (e.value_new, col.editable.type)}

    grid.lock ()

    await response ({type: 'columns', id: row.id, action: 'update'}, {data})

    grid.unlock ()

    grid.set (e.recid, data)

    grid.refresh ()

}
    
////////////////////////////////////////////////////////////////////////////////

$_GET.table_columns = async function (o) {

    return clone ($('body').data ('data'))

}