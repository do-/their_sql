$_DRAW.columns = async function (data) {

    $('title').text ('Все поля')

    $('main').w2regrid ({ 
    
        name: 'columnsGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },            

        columns: [                
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},
            {field: 'type',     caption: 'Тип',    size: 50},
            {field: 'is_pk', caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : ''},
            {field: 'id_ref_table', caption: 'Ссылка',    size: 50, sortable: true},
            {field: 'remark',   caption: 'Их комментарий',    size: 100},
            {field: 'note',     caption: 'Наш комментарий',    size: 100},
        ],
                    
        url: '_back/?type=columns',

//        onDblClick: (e) => open_tab   (`/column/${e.recid}`),

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}