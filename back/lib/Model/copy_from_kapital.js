module.exports = {

    label: 'Копирование текущей схемы KAPITAL',

    returns: 'text',
    
	arg: {
		_id_import: 'uuid',
	},

    body: `
        
    	INSERT INTO tables (
			id,
			is_view, 
			cnt, 
			remark,
			id_import
    	)
    	SELECT
			id,
			is_view, 
			cnt, 
			remark,
			_id_import
    	FROM
    		"k.tables"
    	ON CONFLICT (id) DO UPDATE SET
			is_view   = EXCLUDED.is_view, 
			cnt       = EXCLUDED.cnt, 
			remark    = EXCLUDED.remark,
			id_import = _id_import
    	;
    	
    	INSERT INTO columns (
			id,
			is_pk, 
			type,
			remark,
			id_ref_table,
			id_import
    	)
    	SELECT
			id,
			is_pk, 
			type,
			remark,
			id_ref_table,
			_id_import
    	FROM
    		"k.columns"
    	ON CONFLICT (id) DO UPDATE SET
			is_pk        = EXCLUDED.is_pk, 
			type         = EXCLUDED.type, 
			remark       = EXCLUDED.remark,
			id_ref_table = COALESCE (EXCLUDED.id_ref_table, columns.id_ref_table),
			id_import    = _id_import
    	;

    	RETURN '';

    `

}