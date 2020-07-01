////////////////////////////////////////////////////////////////////////////////

$_DO.show_record_refs = async function (e) {

	darn (e)
	
	let [s, t, c] = e.recid.split ('.')

	w2ui ['main'].show ('bottom', true)
	
	show_block ('table_data', {id_table: s + '.' + t, aaand: {[c]: $('body').data ('data').id}})

}
		
////////////////////////////////////////////////////////////////////////////////

$_DO.hide_record_refs = async function (e) {

	w2ui ['main'].content ('bottom', '')
	w2ui ['main'].hide ('bottom')
	
}

////////////////////////////////////////////////////////////////////////////////

$_GET.record_refs = async function (o) {

    return clone ($('body').data ('data'))

}