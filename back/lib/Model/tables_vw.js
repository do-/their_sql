module.exports = {

    label : 'Таблицы',

    columns : {
        id           : 'string                                      // Имя',
        is_view      : 'int=0                                       // 1, если VIEW', 
        cnt          : 'int                                         // Число записей', 
        note         : 'string                                      // Наш комментарий',
        pk           : 'string                                      // Первичный ключ',
        is_confirmed : 'int=0                                       // 1, если есть в БД', 
        path         : 'string                                      // Путь файла-описания в Model',
        id_status    : 'int                                         // 1, если нет в БД', 
        name         : 'string                                      // Локальное имя',
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
			, path
			, CASE
				WHEN id LIKE 'k.%' AND path IS NULL THEN 2
				WHEN is_confirmed = 0 THEN 1
				ELSE 0
			END AS id_status
			, (PARSE_IDENT (id)) [2] AS name
    	FROM
    		tables
    `

}