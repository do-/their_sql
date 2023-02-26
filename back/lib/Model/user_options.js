module.exports = {

    label : 'Опции пользователей',

    columns : {
        uuid       : 'uuid',
        id_user            : '(users)            // Пользователь', 
        id_voc_user_option : '(voc_user_options) // Опция', 
        is_on              : 'int=0              // Статус (0 — нет, 1 — есть)', 
    },

    pk: 'uuid',

    keys : {
        id_user    : 'UNIQUE (id_user,id_voc_user_option)',
    },

}