$_DRAW.table_new = async function (data) {

    (await to_fill ('table_new', data)).attr ('data-popup-title', 'Новая таблица - копия ' + data.name).w2uppop ({title: 111}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'table_new_form',

            record: data,

            field_options : {                
            },
            
            focus: 1,

        })
    
    })

}