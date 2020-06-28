$_DRAW.tables = async function (data) {

    $('title').text ('Таблицы')

    $('main').w2regrid ({ 
    
        name: 'tablesGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },            

        columns: [                
            {field: 'id',      caption: 'Имя',    size: 50, sortable: true},
            {field: 'remark',  caption: 'Их комментарий',    size: 100},
            {field: 'note',    caption: 'Наш комментарий',    size: 100},
            {field: 'cnt',     caption: '~К-во строк',  size: 20,  sortable: true, render: 'int'},
        ],
                    
        url: '_back/?type=tables',

        onDblClick: (e) => open_tab   (`/table/${e.recid}`),

    }).refresh ();
    
    $('#grid_tablesGrid_search_all').focus ()

}