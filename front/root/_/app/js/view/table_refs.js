$_DRAW.table_refs = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('right'))               

    $panel.w2regrid ({ 
    
        name: 'refColumnsGrid',             
        
        show: {
            toolbar: true,
            toolbarInput: false,
            toolbarReload: false,
            footer: true,
        },            
        
    	toolbar: {
			items: [
		        {type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id + '-links')}},
		    ],
		},

		columnGroups : [
			{span: 2, caption: 'ID'},
			{span: 2, caption: 'Комментарии'},
		],
    
        columns: [
            {field: 'id_table', caption: 'Таблица',    size: 50, sortable: true, attr: 'data-ref=1'},
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true},
            {field: 'tables.note',     caption: 'К таблице',    size: 100},
            {field: 'note',     caption: 'К полю',    size: 100},
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