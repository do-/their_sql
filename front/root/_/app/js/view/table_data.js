$_DRAW.table_data = async function (data) {

	var layout = w2ui ['main']
	
	$('#layout_main_panel_bottom .w2ui-panel-title').text (data.sql)

	var $panel = $(layout.el ('bottom')) 
	
	let columns = data.columns.filter (i => i.is_confirmed == 1)
	
	w2utils.settings.phrases ['not null'] = 'непусто'

    $panel.w2regrid ({ 
    
        name: 'dataGrid',

        selectType : 'cell',

        show: {
            toolbar: true,
            toolbarInput: false,
            footer: true,
        },
        
    	toolbar: {
			items: [
		        {type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id + '-data')}},
		    ],
		},

        searches: columns.filter (i => i.is_confirmed == 1).map (i => {
        
        	let {name, type} = i, o = {
				field: name, 
				caption: name,  
				operator: 'is',
				type: 
					/^date/      .test (type) ? 'date'  : 
					/^(dec|num)/ .test (type) ? 'float' : 
					/int/        .test (type) ? 'int'   : 
					'text'

        	}

        	o.operators =
        		  type == 'uuid' ? ['is', 'null', 'not null'] :
        		o.type == 'text' ? ['is', 'begins', 'contains', 'ends', 'null', 'not null'] :
        		o.type == 'date' ? ['is', 'between', {oper: 'less', text: 'before'}, {oper: 'more', text: 'after'}, 'null', 'not null'] :
        		                   ['is', 'between', {oper: 'less', text: 'less than'}, {oper: 'more', text: 'more than'}, 'null', 'not null']
        	
        	return o
        	
        }),         

        columns: columns.map (i => ({
        	field: i.name, 
        	caption: i.name,  
        	size: 50
        })),

        src: data.src,

        onDblClick: function (e) {
        
        	if (!data.pk) return alert ('Первичного ключа нет - непонятно, как показывать')
        	if (/\,/.test (data.pk)) return alert ('Извините, составной первичный ключ пока не поддерживается')

        	open_tab ('/record/' + data.src [1].id_table + '.' + e.recid)

        },
        
        onSearchOpen: function (e) {
        
        	e.done (function () {
        	
        		let $outer = $('#w2ui-overlay-dataGrid-searchOverlay'), $inner = $('div.w2ui-grid-searches', $outer)
        		
        		let {style} = $outer [0], gap = parseInt (style.top.slice (0, -2)); if (gap < 0) {
        		
        			style.top = '0px'

        			$inner.height ($inner.height () + gap)

        		}

        	})
        
        },
        
        onLoad: function (e) {
        
        	dia2w2ui (e)
        
        	e.done (() => {
        	
        		let ids = {}
        		
        		for (let r of this.records) {
        		        			
        			for (let k in r) {

        				let v = r [k]; if (v == null || /^\s*$/.test (v)) continue

        				if (!ids [k]) ids [k] = 1
        				
        				if (v.length == 29) r [k] = v.replace (/T00:00:00.00.*/, '')

        			}

        		}

        		let sh = {hideColumn: [], showColumn: []}
        		
        		for (let {name} of columns) sh [ids [name] ? 'showColumn' : 'hideColumn'].push (name)
        		
        		for (let [k, v] of Object.entries (sh)) this [k].apply (this, v)

        	})
        
        }

    }).refresh ();
        
    $('#grid_dataGrid_search_all').focus ()

}