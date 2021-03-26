$_DRAW.table = async function (data) {

    $('title').text (data.id)

    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'top', size: 100},
            {type: 'main', size: '*', title: 'Поля этой таблицы'},
            {type: 'right', size: '50%', title: 'Ссылки сюда', resizable: true, off: data.is_view},
            {type: 'bottom', size: 36, hidden: true, resizable: true, title: '<button name=show_data>Показать данные...</button>', 
            	off: data.is_view || data.product == 'clickhouse'
            },
        ].filter (not_off),
                
    })

    $(layout.el ('top')).html (await to_fill ('table', data)).w2reform ({

        name: 'form',
        
        record: data,
        
		onChange: e => e.done ($_DO.update_table),
        
    })
    
    $_DO.edit_table ()
    
	show_block ('table_columns')
	if (!data.is_view) show_block ('table_refs')

}