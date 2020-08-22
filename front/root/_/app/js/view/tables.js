$_DRAW.tables = async function (data) {

    $('title').text ('Таблицы')
    
	w2utils.settings.phrases ['not null'] = 'непусто'

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
				{type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id)}},        
		    ],
		    
		    onClick: function (e) {

				if (this.get (e.target).type == 'check') e.done (() => this.owner.reload ())

		    },

		},

        searches: [
			{field: 'id',  caption: 'Имя', type: 'text'},
			{field: 'note',  caption: 'Комментарий', type: 'text', operators: ['contains', 'begins', 'is', 'misses', 'ends', 'null', 'not null'], operator: 'contains'},
            {field: 'id_status', caption: 'Статус', type: 'enum', options: {items: data.voc_table_status.items}},
			{field: 'pk',  caption: 'Первичный ключ', type: 'text'},
			{field: 'cnt', caption: '~К-во строк', type: 'int'},
		],
		        
        columns: [
            {field: 'id',      caption: 'Имя',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'note',    caption: 'Комментарий',    size: 100},
            {field: 'id_status', caption: 'Статус', size: 50, voc: data.voc_table_status, attr: 'data-status'},
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