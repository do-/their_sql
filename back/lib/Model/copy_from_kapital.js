module.exports = {

    label: 'Копирование текущей схемы KAPITAL',

    returns: 'text',

    body: `
    
    	UPDATE tables  SET is_confirmed=0 WHERE id LIKE 'k.%';
    	UPDATE columns SET is_confirmed=0 WHERE id LIKE 'k.%';
    
    	INSERT INTO tables (
			id,
			is_view, 
			cnt, 
			remark,
			is_confirmed
    	)
    	SELECT
			id,
			is_view, 
			cnt, 
			remark,
			1
    	FROM
    		"k.tables"
    	ON CONFLICT (id) DO UPDATE SET
			is_view = EXCLUDED.is_view, 
			cnt     = EXCLUDED.cnt, 
			remark  = EXCLUDED.remark,
			is_confirmed = 1
    	;
    	
    	INSERT INTO columns (
			id,
			is_pk, 
			type,
			remark,
			id_ref_table,
			is_confirmed
    	)
    	SELECT
			id,
			is_pk, 
			type,
			remark,
			id_ref_table,
			1
    	FROM
    		"k.columns"
    	ON CONFLICT (id) DO UPDATE SET
			is_pk        = EXCLUDED.is_pk, 
			type         = EXCLUDED.type, 
			remark       = EXCLUDED.remark,
			id_ref_table = COALESCE (EXCLUDED.id_ref_table, columns.id_ref_table),
			is_confirmed = 1
    	;

    	RETURN '';

    `

}