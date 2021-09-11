////////////////////////////////////////////////////////////////////////////////

$_GET.columns_html = async function (o) {

	for (let r of o) {
	
		if (r.id_ref_table) {
		
			r.type = '(' + r.id_ref_table.split ('.') [1] + ')'
		
		}
		else {

			r.type = r.type.replace ('(', '[').replace (')', ']')

		}
		
	}
		
    return {src: o.map (i => `<tr>
  <td>${i.name || ''}
  <td>${i.ref_note ? '[[' + i.ref_note + ']]' : i.type || ''}
  <td>${i.note || ''}
  <td>`).join ('\n')}
    
}