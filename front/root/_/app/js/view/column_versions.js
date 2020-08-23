$_DRAW.column_versions = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('main'))              
	
    $panel.w2regrid ({ 
    
        name: 'versionsGrid',             
                
        show: {
            toolbar: true,
            toolbarInput: false,
            footer: true,
        },            
    
        columns: [
        
            {field: '_ts',     caption: 'Дата/время',    size: 20, render: r => dt_dmyhms (r._ts)},
            {field: 'note',     caption: 'Комментарий',    size: 100},
            {field: 'users.label',     caption: 'Автор',    size: 50},

        ].filter (not_off),
        
        records: [],
        
        src: ['columns/versions', {
        	_id: data.id
        }],

    }).refresh ();
    
}