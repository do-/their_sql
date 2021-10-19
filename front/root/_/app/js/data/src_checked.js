////////////////////////////////////////////////////////////////////////////////

$_DO.inject_src_checked = function (e) {

	e.postData.pre = Object.keys ($_LOCAL.get ('src_checked')).join ('|')

},

////////////////////////////////////////////////////////////////////////////////

$_DO.toggle_src_checked = function (id, value) {

	let K = 'src_checked', data = $_LOCAL.get (K)
	
	if (value) data [id] = true; else delete data [id]
    	
	$_LOCAL.set (K, data)
	
}

////////////////////////////////////////////////////////////////////////////////

$_DO.apply_src_checked = async function () {

    let data = $('body').data ('data')
    
 	let s = await $_GET.src_checked ()
 	
 	for (let i of data.src.items) if (s [i.id]) i.checked = true

}

////////////////////////////////////////////////////////////////////////////////

$_DO.create_src_checked = function () {

	let {src: {items: [{id}]}} = $('body').data ('data')
    
	let data = {[id]: true}
    	
	$_LOCAL.set ('src_checked', data)
	
	return data

}

////////////////////////////////////////////////////////////////////////////////

$_GET.src_checked = function (o) {
    
    return $_LOCAL.get ('src_checked') || $_DO.create_src_checked ()

}