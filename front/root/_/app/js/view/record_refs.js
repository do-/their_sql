$_DRAW.record_refs = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('right'))               

    $panel.w2regrid ({ 
    
    	multiSelect: false,
    
        name: 'refColumnsGrid',             
        
        show: {
            toolbar: false,
            toolbarInput: false,
            footer: true,
        },            
        
		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Комментарии'},
		],
    
        columns: [
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},
            {field: 'tables.note',     caption: 'К таблице',    size: 100},
            {field: 'note',     caption: 'К полю',    size: 100},
        ],
                    
        src: ['columns', {
        	id_ref_table: data.table.id
        }],

        onDblClick: null,

		onSelect: $_DO.show_record_refs,
		
		onUnselect: $_DO.hide_record_refs,

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}