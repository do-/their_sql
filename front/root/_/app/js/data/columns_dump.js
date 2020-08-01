////////////////////////////////////////////////////////////////////////////////

$_GET.columns_dump = async function (o) {

	for (let r of o) {
	
		if (r.id_ref_table) {
		
			r.type = '(' + r.id_ref_table.split ('.') [1] + ')'
		
		}
		else {

			r.type = r.type.replace ('(', '[').replace (')', ']')

		}
		
	}

	let src = '', max = k => 1 + Math.max (...o.map (i => i[k].length)), mn = max ('name'), mt = max ('type')
	
	for (let {name, type, id_ref_table, note} of o)
	
		src += `${name}${' '.repeat (mn - name.length)}: '${type}${' '.repeat (mt - type.length)} // ${note}';\n`
		
    return {src}
    
}