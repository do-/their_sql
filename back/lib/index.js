const conf = new (require ('./Config.js'))
const pools = conf.pools

const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

;(async function () {
    
    try {
        await conf.init ()
    }
    catch (x) {
        return darn (['Initialization failed', x])
    }

    require ('http').createServer (
        
        (request, response) => {
        	
        	let http = {request, response}

			let handler = request.url.match (/^\/(\?|_back)/) ? new back ({conf, pools, http}) : new front ({http})

        	handler.run ()
        	
        }

    ).listen (conf.listen, function () {darn ('default app is listening to HTTP at ' + this._connectionKey)})

}) ()