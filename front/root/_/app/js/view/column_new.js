$_DRAW.column_new = async function (data) {

    (await to_fill ('column_new', data)).attr ('data-popup-title', 'Новое поле - копия ' + data.name).w2uppop ({title: 111}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'column_new_form',

            record: data,

            field_options : {                
            },
            
            focus: 1,

        })
    
    })

}