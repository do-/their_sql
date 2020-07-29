module.exports = {

    label: 'Таблицы KAPITAL',
    
	db_link: {kapital: {
		schema_name : 'public', 
		table_name  : 't.tables',
	}},

    columns: {
        id           : 'string // Имя',
        is_view      : 'int=0  // 1, если VIEW', 
        cnt          : 'int    // Число записей', 
        remark       : 'string // Комментарий',
    },

}