module.exports = {

    label : 'Таблицы',

    columns : {
        id           : 'string                                      // Имя',
        is_view      : 'int=0                                       // 1, если VIEW', 
        cnt          : 'int                                         // Число записей', 
        note         : 'string                                      // Наш комментарий',
        pk           : 'string                                      // Первичный ключ',
        is_confirmed : 'int=0                                       // 1, если есть в БД', 
        _status      : 'int                                         // 1, если нет в БД', 
    },
    
    sql: `
		WITH pk AS (
			SELECT
			id_table id
			, STRING_AGG (name, ', ') pk
		FROM
			columns
		WHERE
			is_pk = 1
		GROUP BY
			id_table
		ORDER BY
			id_table
		)
    	SELECT
			tables.id
			, tables.is_view      
			, tables.cnt         
			, COALESCE (tables.note, tables.remark) AS note
      		, (SELECT pk FROM pk WHERE id = tables.id) pk
			, is_confirmed
			, 1-is_confirmed _status
    	FROM
    		tables
    `

}