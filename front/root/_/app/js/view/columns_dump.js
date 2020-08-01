$_DRAW.columns_dump = async function (data) {

    (await to_fill ('columns_dump', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'columns_dump_form',

            record: data,
            
        })
    
    })

}