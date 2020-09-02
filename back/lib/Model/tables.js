module.exports = {

    label : 'Таблицы',

    columns : {
        id           : 'string                                      // Имя',
        is_view      : 'int=0                                       // 1, если VIEW', 
        cnt          : 'int                                         // Число записей', 
        remark       : 'string                                      // Их комментарий',
        note         : 'string                                      // Наш комментарий',
        is_confirmed : 'int=0                                       // 1, если есть в БД', 
        path         : 'string                                      // Путь файла-описания в Model',
        id_import    : '(imports)                                   // Последний импорт',
    },

}