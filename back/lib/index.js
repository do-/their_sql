const conf        = new (require ('./Config.js'))
const http_server = new (require ('./HttpServer.js')) (conf)

;(async () => {
    
    try {    
        await conf.init ();        darn ('Configuration loaded OK')
        await http_server.init (); darn ('Listening to HTTP on ' + http_server._._connectionKey)
    }
    catch (x) {
        darn (['Initialization failed', x])
    }

}) ()