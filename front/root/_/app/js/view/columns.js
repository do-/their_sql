$_DRAW.columns = async function (data) {

    $('title').text ('Все поля')

    $('main').w2regrid ({ 
    
        name: 'columnsGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },            
        
		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Опции'},
			{span: 2, caption: 'Комментарии к полю'},
			{span: 3, caption: 'Ссылка'},
		],
    
        columns: [
        
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},

            {field: 'type',     caption: 'Тип',    size: 50},
            {field: 'is_pk',    caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : ''},
            
            {field: 'remark',   caption: 'Их',    size: 100},
            {field: 'note',     caption: 'Наш',    size: 100, editable: {type: 'text'}},
            
            {field: 'id_ref_table',    caption: 'Имя',    size: 50, sortable: true},
            {field: 'tables.remark',   caption: 'Их комментарий',     size: 100},
            {field: 'tables.note',     caption: 'Наш комментарий',    size: 100},
            
        ],
                    
        url: '_back/?type=columns',

        onDblClick: null,
        
		onChange: $_DO.patch_columns,        

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}