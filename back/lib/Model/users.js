module.exports = {

    label : 'Пользователи',

    columns : {
        uuid       : 'uuid',
        id_role    : '(roles)=2                                   // Роль',           
        is_deleted : 'int=0                                       // 1, если удалён', 
        label      : 'string      /^[А-ЯЁ][А-ЯЁа-яё \\-]+[а-яё]$/ // ФИО',
        login      : 'string      /^[A-Za-z0-9_\.]+$/             // login',             
        mail       : 'string                                      // E-mail',              
        password   : 'string                                      // Пароль',             
        salt       : 'string                                      // "Соль" пароля',
    },

    pk: 'uuid',

    keys : {
        login    : 'UNIQUE (login)',
    },

    data : [
        {uuid: '00000000-0000-0000-0000-000000000000', id_role: 1},
    ],
    
    triggers : {

        before_insert_update : function () {

			return this.model.trg_check_column_values (this) + 'RETURN NEW;'

        },

    },

}