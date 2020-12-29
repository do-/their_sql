module.exports = {

    label : 'Таблицы',

    columns : {
        id           : 'string                                      // Полное имя',
        is_pk        : 'int=0                                       // 1, если первичный ключ', 
        name         : 'string                                      // Имя',
        type         : 'string                                      // Тип',
        note         : 'string                                      // Наш комментарий',
        id_table     : '(tables)                                    // Таблица',           
        id_ref_table : 'string                                      // Ссылка',           
        is_confirmed : 'int=0                                       // 1, если есть в БД', 
        _status      : 'int                                         // 1, если нет в БД', 
        table_name   : 'string                                      // Имя таблицы',
        ref_name     : 'string                                      // Имя таблицы по ссылке',
        table_note   : 'string                                      // Комментарий к таблице',
        ref_note     : 'string                                      // Комментарий к таблице по ссылке',
    },
    
    sql: `
    	SELECT
			t.id           
			, t.is_pk        
			, t.name         
			, t.type         
			, COALESCE (t.note, t.remark) AS note
			, t.id_table      
			, t.id_ref_table 
			, t.is_confirmed
			, 1 - t.is_confirmed _status
			, tables.name table_name
			, ref.name ref_name
			, tables.note table_note
			, ref.note ref_note
    	FROM
    		columns t
    		LEFT JOIN tables_vw AS tables ON t.id_table    = tables.id
    		LEFT JOIN tables_vw AS ref   ON t.id_ref_table = ref.id

    `

}