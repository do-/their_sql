module.exports = {

    label: 'Копирование текущей схемы KAPITAL',

    returns: 'text',

    body: `
    
    	INSERT INTO tables (
			id,
			is_view, 
			cnt, 
			remark
    	)
    	SELECT
			id,
			is_view, 
			cnt, 
			remark
    	FROM
    		"k.tables"
    	ON CONFLICT (id) DO UPDATE SET
			is_view = EXCLUDED.is_view, 
			cnt     = EXCLUDED.cnt, 
			remark  = EXCLUDED.remark
    	;
    	
    	INSERT INTO columns (
			id,
			is_pk, 
			type,
			remark,
			id_ref_table
    	)
    	SELECT
			id,
			is_pk, 
			type,
			remark,
			id_ref_table
    	FROM
    		"k.columns"
    	ON CONFLICT (id) DO UPDATE SET
			is_pk        = EXCLUDED.is_pk, 
			type         = EXCLUDED.type, 
			remark       = EXCLUDED.remark,
			id_ref_table = COALESCE (EXCLUDED.id_ref_table, columns.id_ref_table)
    	;    	
    	
    	RETURN '';

    `

}