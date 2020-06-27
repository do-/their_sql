////////////////////////////////////////////////////////////////////////////////

$_GET.columns = async function (o) {

    let data = await response ({type: 'columns', part: 'vocs'})
    
    add_vocabularies (data, {})
    
    $('body').data ('data', data)
            
    return data

}