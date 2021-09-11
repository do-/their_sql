$_DRAW.columns_html = async function (data) {

    (await to_fill ('columns_html', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'columns_html_form',

            record: data,
            
        })
    
    })

}