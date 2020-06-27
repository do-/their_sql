module.exports = {

    label : 'Поля',

    columns : {
        id           : 'string                                      // Имя',
        is_pk        : 'int=0                                       // 1, если первичный ключ', 
        type         : 'string                                      // Тип',
        remark       : 'string                                      // Комментарий в БД',
        id_ref_table : '(tables)                                    // Ссылка',           
    },

}