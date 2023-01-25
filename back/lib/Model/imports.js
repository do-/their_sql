module.exports = {

    label: 'Импорты KAPITAL',

    columns: {
        uuid       : 'uuid',
        id_src     : 'text',
        ts_created : 'timestamp=now()',
        is_over    : 'int=0',
    },

    pk: 'uuid',

}