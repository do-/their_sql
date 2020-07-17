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
    },
    
    sql: `
    	SELECT
			id           
			, is_pk        
			, name         
			, type         
			, COALESCE (note, remark) AS note
			, id_table      
			, id_ref_table 
    	FROM
    		columns
    `

}