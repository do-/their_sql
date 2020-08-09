$_DRAW.tables = async function (data) {

    $('title').text ('Таблицы')

    $('main').w2regrid ({ 
    
        name: 'tablesGrid',             

        show: {
            toolbar: true,
            footer: true,
        },
        
    	toolbar: {

			items: [
			
				{type: 'break' },
				
				{type: 'check', id: 'k', text: 'Наша БД', checked: true},
				{type: 'check', id: 'eias', text: 'ЕИАС ЖКХ МО', checked: true},
				{type: 'check', id: 'fkr|mkd_service', text: 'MySQL'},
				
				{type: 'break' },
				
		        {type: 'button', id: 'refreshKapitalButton', caption: 'Обновить KAPITAL', onClick: $_DO.refresh_kapital_tables},
		    ],
		    
		    onClick: function (e) {

				if (this.get (e.target).type == 'check') e.done (() => this.owner.reload ())

		    },

		},

        searches: [
			{field: 'id',  caption: 'Имя', type: 'text'},
			{field: 'remark',  caption: 'Их комментарий', type: 'text'},
			{field: 'note',  caption: 'Наш комментарий', type: 'text'},
			{field: 'pk',  caption: 'Первичный ключ', type: 'text'},
			{field: 'cnt', caption: '~К-во строк', type: 'int'},
		],
		        
        columns: [
            {field: 'id',      caption: 'Имя',    size: 50, sortable: true, attr: 'data-ref=1 data-status'},
            {field: 'note',    caption: 'Комментарий',    size: 100},
            {field: 'pk',      caption: 'ПК',  size: 20},
            {field: 'cnt',     caption: '~К-во строк',  size: 20,  sortable: true, render: 'int'},
        ],
                    
        src: 'tables',
        
        onDblClick: null,

        onRequest: function (e) {
        
        	e.postData.pre = this.toolbar.items.filter (i => i.type == 'check' && i.checked).map (i => i.id).join ('|')

        },
        
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