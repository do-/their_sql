////////////////////////////////////////////////////////////////////////////////

$_DO.open_tables_nav = function () {
    open_tab ('/tables')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_columns_nav = function () {
    open_tab ('/columns')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_users_nav = function () {
    open_tab ('/users')
}
    
////////////////////////////////////////////////////////////////////////////////

$_DO.open_user_password_nav = function () {
    show_block ('user_password')
}
        
////////////////////////////////////////////////////////////////////////////////

$_DO.open_settings_nav = function () {
    show_block ('user_own_options')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.logout_nav = function () {

    if (!confirm ("Завершить работу в системе?")) return
        
    query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
    
    $_SESSION.end ()

    redirect ('/')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.nav = async function (o) {

    let is_admin = ($_USER.role == 'admin')
    
    return {
    
        header: [
        
            {
                id: "open_tables",
                label: "Таблицы",
                icon: "menu",
            },
            {
                id: "open_columns",
                label: "Столбцы",
                icon: "menu",
            },
            {
                id: "open_users",
                label: "Пользователи",
                icon: "users",
                off: !is_admin
            },
            
        ].filter (not_off),
        
        footer: [
        
            {
                id: "open_user_password",
                label: "Смена пароля",
                icon: "keys",
//                off: is_admin
            },
            {
                id: "open_settings",
                label: "Настройки",
                icon: "settings",
            },
            {
                id: "logout",
                label: "Выход",
                icon: "logout",
            },
            
        ].filter (not_off),
        
    }
    
}