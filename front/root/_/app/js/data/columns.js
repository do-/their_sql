////////////////////////////////////////////////////////////////////////////////

$_DO.patch_columns = async function (e) {

    let grid = this, row = grid.get (e.recid), col = grid.columns [e.column]

    let data = {[col.field]: normalizeValue (e.value_new, col.editable.type)}

    grid.lock ()

    await response ({type: 'columns', id: row.id, action: 'update'}, {data})

    grid.unlock ()

    grid.set (e.recid, data)

    grid.refresh ()

}
    
////////////////////////////////////////////////////////////////////////////////

$_GET.columns = async function (o) {

    let data = await response ({type: 'columns', part: 'vocs'})
    
    add_vocabularies (data, {})
    
    $('body').data ('data', data)
            
    return data

}