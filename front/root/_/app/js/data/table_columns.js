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