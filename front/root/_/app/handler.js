(function () {

    clearTimeout (window.alarm)
    
    $(window).keydown (check_hotkeys)

    if (!$_USER) return show_block ('login')

    let [type, id] = location.pathname.split ('/').filter ((i) => i)

    if (!type) return redirect (window.name = '/tables')

    $_REQUEST = {type, id}

    show_block ('main')

})()