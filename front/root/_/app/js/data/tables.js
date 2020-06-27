////////////////////////////////////////////////////////////////////////////////

$_GET.tables = async function (o) {

    let data = await response ({type: 'tables', part: 'vocs'})
    
    add_vocabularies (data, {})
    
    $('body').data ('data', data)
            
    return data

}