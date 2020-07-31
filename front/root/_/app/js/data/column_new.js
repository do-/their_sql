////////////////////////////////////////////////////////////////////////////////

$_DO.update_column_new = async function (e) {

    let f = w2_popup_form (), {id, name, note} = f.values ().actual ().validated ()

    f.lock ()

    let item = await response ({type: 'columns', action: 'clone', id}, {data: {name, note}})

	w2popup.close ()
	
	let g = w2ui ['columnsGrid']; g.reload (g.refresh)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.column_new = async function (o) {

    return o
    
}