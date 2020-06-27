$_DRAW.table = async function (data) {

    $('title').text (data.id)

    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'top', size: 230},
            {type: 'main', size: 400,
				tabs: [
                	{id: 'table_columns', caption: 'Поля'},
				],
            },
        ],
                
    })

    $(layout.el ('top')).html (await to_fill ('table', data)).w2reform ({

        name: 'form',
        
        record: data,
        
    })

}