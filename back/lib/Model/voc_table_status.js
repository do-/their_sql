module.exports = {

    label: 'Статусы таблицы',

    columns: {
        id       : 'int',
        label    : 'string // Наименование',
    },

    data: [
    	{id: 0, label: 'OK'},
    	{id: 1, label: 'Нет в БД'},
    	{id: 2, label: 'Не описана'},
    ],

}