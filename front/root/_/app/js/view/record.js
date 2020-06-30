$_DRAW.record = async function (data) {

    $('title').text (data.table.id + ' №' + data.id)

    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'top', size: 50},
            {type: 'main', size: '*', title: 'Содержимое непустых полей'},
        ].filter (not_off),
                
    })

    $(layout.el ('top')).html (await to_fill ('record', data)).w2reform ({

        name: 'form',
        
        record: data,
                
    })
    
    clickOn ($('#table_href'), () => open_tab ('/table/' + data.table.id))
        
	var $panel = $(layout.el ('main'))               

    $panel.w2regrid ({ 
    
        name: 'columnsGrid',             
        
        multiSelect: false,
        
        show: {
            toolbar: false,
            toolbarInput: false,
            footer: true,
        },            
        
		columnGroups : [
			{span: 1, master: true},
			{span: 1, master: true},
			{span: 2, caption: 'Опции'},
			{span: 2, caption: 'Комментарии к полю'},
			{span: 3, caption: 'Ссылка'},
		],
    
        columns: [
        
            {field: 'name',     caption: 'Имя',    size: 50},
            {field: 'value',    caption: 'Значение',    size: 100},

            {field: 'type',     caption: 'Тип',    size: 50},
            {field: 'is_pk',    caption: 'ПК?',    size: 10, render: r => r.is_pk ? 'ПК' : '', off: data.is_view},
            
            {field: 'remark',   caption: 'Их',    size: 100},
            {field: 'note',     caption: 'Наш',    size: 100, editable: {type: 'text'}},
            
            {field: 'id_ref_table',    caption: 'Имя',    size: 50, attr: 'data-ref=1'},
            {field: 'tables.remark',   caption: 'Их комментарий',     size: 100},
            {field: 'tables.note',     caption: 'Наш комментарий',    size: 100},
            
        ].filter (not_off),
                    
		records: data.columns.filter (i => 'value' in i),
        
		onChange: $_DO.patch_columns,        

        onDblClick: function (e) {
        
        	let {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'is_pk': 
        			return $_DO.set_pk_table_columns.call (this, e)
        		case 'id_ref_table':
        			this.select (e.recid)
        			return show_block ('set_ref_columns_popup')
        	}

        },
        
        onClick: function (e) {
        
        	let r = this.get (e.recid), {field} = this.columns [e.column]
        
        	switch (field) {
        		case 'id_ref_table':
        			let id = r [field]
        			if (id) open_tab (`/record/${id}.${r.value}`)
        	}
        
        },
        
        onLoad: function (e) {
        
        	dia2w2ui (e)
        
        	if (!data.is_view) e.done (() => {
        	
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

}