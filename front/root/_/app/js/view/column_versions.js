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
        
            {field: '_ts',     caption: 'Дата/время',    size: 35, min: 35, render: r => dt_dmyhms (r._ts)},
            {field: 'remark',     caption: 'Комментарий в модели',    size: 100},
            {field: 'note',     caption: 'Комментарий аналитика',    size: 100},
            {field: 'type',     caption: 'Тип',    size: 100},
            {field: 'id_ref_table',     caption: 'Ссылка',    size: 100},
            {field: '_action',     caption: 'Действие',    size: 50},
            {field: 'users.label',     caption: 'Пользователь',    size: 50},

        ].filter (not_off),
        
        records: [],
        
        src: ['columns/versions', {
        	_id: data.id
        }],

    }).refresh ();
    
}