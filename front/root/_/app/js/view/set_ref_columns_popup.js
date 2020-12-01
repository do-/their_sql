$_DRAW.set_ref_columns_popup = async function (data) {

    $(fill (await use.jq ('set_ref_columns_popup'), data)).w2uppop ({}, function () {

        darn($('.grid-container')).w2regrid ({ 
        
            name: 'tables_grid',
            
            show: {
                toolbar: true,
                toolbarReload: false,
                footer: false,
                columnHeaders: true,
            },     
                        
			columns: [                
				{field: 'id',      caption: 'Имя',    size: 50, sortable: true},
				{field: 'pk',      caption: 'ПК',    size: 50, sortable: true},
				{field: 'remark',  caption: 'Их комментарий',    size: 100},
				{field: 'note',    caption: 'Наш комментарий',    size: 100},
				{field: 'cnt',     caption: '~К-во строк',  size: 20,  sortable: true, render: 'int'},
			],
			
			onRequest: function (e) {
			
				let [id] = $_REQUEST.id.split ('.')
			
				e.postData.pre = /^(fkr|mkd)/.test (id) ? "fkr|fkr_rr|mkd_service|fkr_event|fkr_tasks" : id
			
			},

			src: 'tables',
			
			onDblClick: $_DO.update_set_ref_columns_popup,
            
        }).search ('all', data.name)

   })

}