$_DO.check_toolbar_tables = function (e) {

	if (e.type == 'click' && e.item.type != 'check') return

	let grid = w2ui ['tablesGrid']; if (!grid) return

	let {toolbar} = grid

	e.done (() => {

		for (let {type, id} of toolbar.items) 
		
			if (type == 'button' && !/^w2ui-/.test (id) && id != 'printButton') 

				toolbar.hide (id)
		
		if ($_USER.role == 'admin') {

			let checked = toolbar.items.filter (i => i.type == 'check' && i.checked)

			if (checked.length == 1) toolbar.show ('refresh_' + checked [0].id)

		}
		
		if (e.type == 'click') {

			let {target} = e, {checked} = toolbar.get (target)

			$_DO.toggle_src_checked (target, checked)

			grid.reload ()

		}

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

				{type: 'break'},
				
				...data.src.items.map (i => ({type: 'check', ...i})),

				{type: 'break'},

				...data.src.items.map (({id}) => ({
					type: 'button', 
					id: 'refresh_' + id, 
					caption: 'Обновить', 
					onClick: $_DO.refresh_tables, 
					hidden: true
				})),

				{type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id)}},

		    ],

		    onClick: $_DO.check_toolbar_tables,

		},

        searches: [
			{field: 'name',  caption: 'Только имя', type: 'text'},
			{field: 'id',  caption: 'Схема.имя', type: 'text'},
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

        onRequest: $_DO.inject_src_checked,

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