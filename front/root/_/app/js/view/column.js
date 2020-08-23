$_DRAW.column = async function (data) {

    $('title').text (data.id)

    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'top', size: 100},
            {type: 'main', size: '*', title: 'История редактирования'},
        ].filter (not_off),
                
    })

    $(layout.el ('top')).html (await to_fill ('column', data)).w2reform ({

        name: 'form',
        
        record: data,
        
		onChange: e => e.done ($_DO.update_column),
        
    })
    
    $_DO.edit_column ()
    
	show_block ('column_versions')

}