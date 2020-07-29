module.exports = {

    label : 'Таблицы',

    columns : {
        id           : 'string                                      // Имя',
        is_view      : 'int=0                                       // 1, если VIEW', 
        cnt          : 'int                                         // Число записей', 
        note         : 'string                                      // Наш комментарий',
        pk           : 'string                                      // Первичный ключ',
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
    	FROM
    		tables
    `

}