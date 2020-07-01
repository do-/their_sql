$_DRAW.table_data = async function (data) {

darn (data.columns)

	var layout = w2ui ['main']
	
	$('#layout_main_panel_bottom .w2ui-panel-title').text (data.sql)

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
        	field: i.name, 
        	caption: i.name,  
        	size: 50
        })),

        src: data.src,

        onDblClick: function (e) {
        
        	if (!data.pk) return alert ('Первичного ключа нет - непонятно, как показывать')

        	open_tab ('/record/' + data.src [1].id_table + '.' + e.recid)

        },
        
        onLoad: function (e) {
        
        	dia2w2ui (e)
        
        	e.done (() => {
        	
        		let ids = {}
        		
        		for (let r of this.records) {

        			for (let k in r) if (!ids [k] && r [k] != null) ids [k] = 1

        		}
        		
        		let nil = data.columns.map (i => i.name).filter (i => !ids [i])
        		
        		this.hideColumn.apply (this, nil)
        		
        	})
        
        }

    }).refresh ();
    
    $('#grid_dataGrid_search_all').focus ()

}