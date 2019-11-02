const conf        = new (require ('./Config.js'))
const http_router = new (require ('./HttpRouter.js')) (conf)

;(async () => {
    
    try {    
        await conf.init ();        darn ('Configuration loaded OK')
        await http_router.init (); darn ('Listening to HTTP on ' + http_router._._connectionKey)
    }
    catch (x) {
        darn (['Initialization failed', x])
    }

}) ()