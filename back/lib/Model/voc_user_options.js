module.exports = {

    label: 'Опции пользователя',

    columns: {
        id       : 'int',
        name     : 'string // Символическое имя',
        roles    : 'string // Имена ролей',
        label    : 'string // Наименование',
        is_own   : 'int=0  // Доступна ли для самостоятельной настройки',
    },

    pk       : 'id',

    keys: {
        label    : 'label',
    },

    data: [
        {id: 1, is_own: 1, name: 'no_tabs', label: 'Не открывать новые вкладки при переходах'},
    ],

}