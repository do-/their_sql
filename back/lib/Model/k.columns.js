module.exports = {

    label: 'Поля KAPITAL',
    
	db_link: {kapital: {
		schema_name : 'public', 
		table_name  : 't.columns',
	}},

    columns: {
        id           : 'string                                      // Полное имя',
        is_pk        : 'int=0                                       // 1, если первичный ключ', 
        type         : 'string                                      // Тип',
        remark       : 'string                                      // Комментарий в БД',
        id_ref_table : 'string                                      // Ссылка',
    },

}