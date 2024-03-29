$_DO.check_toolbar_columns = function (e) {

	if (e.type == 'click' && e.item.type != 'check') return

	let grid = w2ui ['columnsGrid']; if (!grid) return

	let {toolbar} = grid

	if (e.type == 'click') e.done (() => {
	
		let {target} = e, {checked} = toolbar.get (target)

		$_DO.toggle_src_checked (target, checked)

		grid.reload ()
	
	})

}

$_DRAW.columns = async function (data) {

    $('title').text ('Все поля')

    $('main').w2regrid ({ 
    
        name: 'columnsGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },
		
    	toolbar: {

			items: [

				{type: 'break' },

/*
				{type: 'check', id: 'bf_50', text: 'bf_50', checked: true},
				{type: 'check', id: 'k', text: 'АСУ ФКР'},
				{type: 'check', id: 'eias', text: 'ЕИАС ЖКХ МО'},
				{type: 'check', id: 'fkr|fkr_rr|mkd_service|fkr_event|fkr_tasks', text: 'MySQL'},
				{type: 'check', id: 'app_foab', text: 'MSSQL'},
*/

				...data.src.items.map (i => ({type: 'check', ...i})),

				{type: 'break' },

				{type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id)}},
				{type: 'button', id: 'edit', caption: 'Проставить ссылки...', onClick: $_DO.set_ref_columns, icon: 'w2ui-icon-pencil'},

		    ],

		    onClick: $_DO.check_toolbar_columns,

		},
		
        searches: [
			{field: 'table_name',  caption: 'Наименование таблицы', type: 'text'},
			{field: 'table_note',  caption: 'Комментарий к таблице', type: 'text'},
			{field: 'name',  caption: 'Наименование колонки', type: 'text'},
			{field: 'note',  caption: 'Комментарий к колонке', type: 'text'},
		],		

		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Опции'},
			{span: 2, caption: 'Комментарии'},
			{span: 2, caption: 'Ссылка'},
		],
    
        columns: [
        
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},

            {field: 'type',     caption: 'Тип',    size: 50},
            {field: 'is_pk',    caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : ''},
            
            {field: 'table_note',   caption: 'К таблице',    size: 100},
            {field: 'note',     caption: 'К полю',    size: 100, editable: {type: 'text'}},
            
            {field: 'id_ref_table',    caption: 'Имя',    size: 50, attr: 'data-ref=1'},
            {field: 'ref_note',     caption: 'Комментарий',    size: 100},
            
        ],
                    
        src: 'columns',

        onRequest: $_DO.inject_src_checked,

        onDblClick: null,
        
		onChange: $_DO.patch_columns,        

        onClick: function (e) {
        
        	let r = this.get (e.recid), {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'id_table':
        		case 'id_ref_table':
        			 open_tab (`/table/${r [field]}`)
        	}
        
        },

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}