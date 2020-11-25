$_DO.check_toolbar_tables = function (e) {

	if (e.type == 'click' && e.item.type != 'check') return

	let grid = w2ui ['tablesGrid']; if (!grid) return

	let {toolbar} = grid

	e.done (() => {

		for (let i of toolbar.items) if (i.type == 'button') toolbar.hide (i.id)

		if ($_USER.role == 'admin') {

			let checked = toolbar.items.filter (i => i.type == 'check' && i.checked)

			if (checked.length == 1) toolbar.show ('refresh_' + checked [0].id)

		}
		
		toolbar.show ('printButton')

		if (e.type == 'click') grid.reload ()

	})

}

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

				{type: 'check', id: 'bf_50', text: 'bf_50'},
				{type: 'check', id: 'k', text: 'АСУ ФКР'},
				{type: 'check', id: 'eias', text: 'ЕИАС ЖКХ МО'},
				{type: 'check', id: 'fkr|fkr_rr|mkd_service|fkr_event|fkr_tasks', text: 'MySQL'},
				{type: 'check', id: 'app_foab', text: 'MSSQL', checked: true},

				{type: 'break' },

//		        {type: 'button', id: 'refresh_k', caption: 'Обновить', onClick: $_DO.refresh_kapital_tables, hidden: true},
		        {type: 'button', id: 'refresh_bf_50', caption: 'Обновить', onClick: $_DO.refresh_bf_50_tables, hidden: true},
		        {type: 'button', id: 'refresh_fkr|fkr_rr|mkd_service|fkr_event|fkr_tasks', caption: 'Обновить', onClick: $_DO.refresh_oviont_tables, hidden: true},
		        {type: 'button', id: 'refresh_app_foab', caption: 'Обновить', onClick: $_DO.refresh_nn_tables, hidden: true},

				{type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id)}},

		    ],

		    onClick: $_DO.check_toolbar_tables,

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

        onRefresh: $_DO.check_toolbar_tables,

    }).refresh ();

    $('#grid_tablesGrid_search_all').focus ()

}