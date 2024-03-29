$_DRAW.table_columns = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('main'))              
	
	w2utils.settings.phrases.Edit = 'Клонировать'

    $panel.w2regrid ({ 
    
        name: 'columnsGrid',             
                
        show: {
            toolbar: true,
            toolbarEdit: true,
            toolbarDelete: true,
            toolbarInput: false,
            toolbarReload: false,
            footer: true,
        },            

    	toolbar: {
			items: [
		        {type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS (data.id)}},        
		        {type: 'button', id: 'dumpButton', caption: 'Model', onClick: $_DO.dump_table_columns},
		        {type: 'button', id: 'htmlButton', caption: 'HTML', onClick: $_DO.html_table_columns},
		    ],
		},
        
		columnGroups : [
			{span: 1, master: true},
			{span: 2 - data.is_view, caption: 'Опции'},
			{span: 1, master: true},
			{span: 3, caption: 'Ссылка'},
		],
    
        columns: [
        
            {field: 'name',     caption: 'Поле',    size: 50, sortable: true, attr: 'data-status data-ref=1'},

            {field: 'type',     caption: 'Тип',    size: 50, editable: {type: 'text'}, attr: 'data-status'},
            {field: 'is_pk',    caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : '', off: data.is_view, attr: 'data-status'},
            
            {field: 'note',     caption: 'Комментарий',    size: 100, editable: {type: 'text'}, attr: 'data-status'},
            
            {field: 'id_ref_table',    caption: 'Таблица',    size: 50, attr: 'data-ref=1', title: i => i.ref_note || null},
            {field: 'ref_pk_name',    caption: 'Столбец',    size: 20, title: i => i.ref_pk_note || null},
            
        ].filter (not_off),
                    
        src: ['columns', {
        	id_table: data.id
        }],
        
		onChange: $_DO.patch_columns,        

        onDblClick: function (e) {
        
        	let {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'is_pk': 
        			return $_DO.set_pk_table_columns.call (this, e)
        		case 'id_ref_table':
        			this.select (e.recid)
        			return show_block ('set_ref_columns_popup')
        		case 'ref_pk_name': 
        			return $_DO.drop_fk_table_columns.call (this, e)
        	}

        },
        
        onClick: function (e) {
        
        	let r = this.get (e.recid), {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'name':
        			return open_tab (`/column/${r.id}`)
        		case 'id_table':
        		case 'id_ref_table':
        			let id = r [field]
        			if (id) open_tab (`/table/${id}`)
        	}
        
        },
        
        onEditField: function (e) {
        
        	let {field} = this.columns [e.column], {is_confirmed} = this.get (e.recid)

        	if (field == 'type' && is_confirmed == 1) return e.preventDefault ()

        },
        
        onLoad: function (e) {
        
        	dia2w2ui (e)
        
        	if (!data.is_view) e.done (() => {
        	
        		let data = $('body').data ('data')
        		
        		data.columns = this.records				
        		
        		let pk = data.columns.filter (i => i.is_pk)
        		
        		if (pk.length) {

					$('body').data ('data', data)
					
					w2ui ['main'].show ('bottom')
					$('button[name=show_data]').unbind ('click' ).click ($_DO.show_data_table)


//					show_block ('table_data', {id_table: data.id})

        		}
        		else {
        		
					$(layout.el ('bottom')).html ('<br><br><br><center>Первичного ключа нет, данные показывать не будем')
        		
        		}
        	
        	})
        
        },
        
        onEdit: $_DO.clone_table_columns,

        onDelete: $_DO.delete_table_columns,

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}