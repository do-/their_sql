$_DRAW.table_columns = async function (data) {

    $(w2_waiting_panel ()).w2regrid ({ 
    
        name: 'columnsGrid',             
        
        show: {
            toolbar: false,
            toolbarInput: false,
            footer: true,
        },            
        
		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Опции'},
			{span: 2, caption: 'Комментарии к полю'},
			{span: 3, caption: 'Ссылка'},
		],
    
        columns: [
        
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},

            {field: 'type',     caption: 'Тип',    size: 50},
            {field: 'is_pk',    caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : ''},
            
            {field: 'remark',   caption: 'Их',    size: 100},
            {field: 'note',     caption: 'Наш',    size: 100, editable: {type: 'text'}},
            
            {field: 'id_ref_table',    caption: 'Имя',    size: 50, attr: 'data-ref=1'},
            {field: 'tables.remark',   caption: 'Их комментарий',     size: 100},
            {field: 'tables.note',     caption: 'Наш комментарий',    size: 100},
            
        ],
                    
        src: ['columns', {
        	id_table: data.id
        }],

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