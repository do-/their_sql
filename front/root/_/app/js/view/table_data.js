$_DRAW.table_data = async function (data) {

darn (data.columns)

	var layout = w2ui ['main']

	var $panel = $(layout.el ('bottom'))               

    $panel.w2regrid ({ 
    
        name: 'dataGrid',             
        
        show: {
            toolbar: true,
            toolbarInput: false,
            footer: true,
        },
        
        searches: data.columns.map (i => {
        
        	let {name, type} = i
        
        	return {
				field: name, 
				caption: name,  
				type: 
					/^date/    .test (type) ? 'date'  : 
					/^decimal/ .test (type) ? 'float' : 
					/int/      .test (type) ? 'int'   : 
					'text'

        	}
        }),         

        columns: data.columns.map (i => ({
        	field: i.name.toUpperCase (), 
        	caption: i.name,  
        	size: 50
        })),

        src: ['table_data', {
        	id_table: data.id
        }],

    }).refresh ();
    
    $('#grid_dataGrid_search_all').focus ()

}