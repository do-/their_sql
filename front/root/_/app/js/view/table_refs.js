$_DRAW.table_refs = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('right'))               

    $panel.w2regrid ({ 
    
        name: 'refColumnsGrid',             
        
        show: {
            toolbar: false,
            toolbarInput: false,
            footer: true,
        },            
        
		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Комментарии к таблице'},
		],
    
        columns: [
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},
            {field: 'remark',   caption: 'Их',    size: 100},
            {field: 'note',     caption: 'Наш',    size: 100, editable: {type: 'text'}},
        ],
                    
        src: ['columns', {
        	id_ref_table: data.id
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