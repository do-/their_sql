$_DRAW.table_columns = async function (data) {

	var layout = w2ui ['main']

	var $panel = $(layout.el ('main'))               

    $panel.w2regrid ({ 
    
        name: 'columnsGrid',             
        
        show: {
            toolbar: false,
            toolbarInput: false,
            footer: true,
        },            
        
		columnGroups : [
			{span: 1, master: true},
			{span: 2, caption: 'Опции'},
			{span: 2, caption: 'Комментарии к полю'},
			{span: 3, caption: 'Ссылка'},
		],
    
        columns: [
        
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
        
		onChange: $_DO.patch_columns,        

        onDblClick: function (e) {
        
        	let {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'is_pk': return $_DO.set_pk_table_columns.call (this, e)
        	}

        },
        
        onClick: function (e) {
        
        	let r = this.get (e.recid), {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'id_table':
        		case 'id_ref_table':
        			 open_tab (`/table/${r [field]}`)
        	}
        
        },
        
        onLoad: function (e) {
        
        	dia2w2ui (e)
        
        	e.done (() => {
        	
        		let data = $('body').data ('data')
        		
        		data.columns = this.records
        		
        		let pk = data.columns.filter (i => i.is_pk)
        		
        		if (pk.length) {

					$('body').data ('data', data)

					show_block ('table_data')

        		}
        		else {
        		
					$(layout.el ('bottom')).html ('<br><br><br><center>Первичного ключа нет, данные показывать не будем')
        		
        		}
        	
        	})
        
        }

    }).refresh ();
    
    $('#grid_columnsGrid_search_all').focus ()

}