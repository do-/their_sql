$_DRAW.tables = async function (data) {

    $('title').text ('Таблицы')

    $('main').w2regrid ({ 
    
        name: 'tablesGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },            
        
        searches: [
			{field: 'id',  caption: 'Имя', type: 'text'},
			{field: 'remark',  caption: 'Их комментарий', type: 'text'},
			{field: 'note',  caption: 'Наш комментарий', type: 'text'},
			{field: 'pk',  caption: 'Первичный ключ', type: 'text'},
			{field: 'cnt', caption: '~К-во строк', type: 'int'},
		],
		        
        columns: [                
            {field: 'id',      caption: 'Имя',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'remark',  caption: 'Их комментарий',    size: 100},
            {field: 'note',    caption: 'Наш комментарий',    size: 100},
            {field: 'pk',      caption: 'ПК',  size: 20},
            {field: 'cnt',     caption: '~К-во строк',  size: 20,  sortable: true, render: 'int'},
        ],
                    
        src: 'tables',

        onClick: function (e) {
        
        	let r = this.get (e.recid), {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'id':
        			 open_tab (`/table/${r [field]}`)
        	}
        
        },

    }).refresh ();
    
    $('#grid_tablesGrid_search_all').focus ()

}