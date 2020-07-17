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
    	SELECT
			tables.id
			, tables.is_view      
			, tables.cnt         
			, COALESCE (tables.note, tables.remark) AS note
			, pk.name AS pk
    	FROM
    		tables
    		LEFT JOIN columns AS pk ON (
    			pk.id LIKE tables.id || '.%'
    			AND pk.is_pk = 1
    		)
    `

}