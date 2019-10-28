const http = require ('http')

const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class {

    constructor (conf) {    
    	this.conf = conf
    }
    
	create_http_handler (http) {

		if (http.request.url.match (/^\/(\?|_back)/)) return new back ({conf: this.conf, pools: this.conf.pools, http})

		return new front ({http})

	}
	
	create_http_server () {

		return http.createServer (
			(request, response) => this.create_http_handler ({request, response}).run ()
		)

	}
	
	async init () {
		
		return new Promise ((ok, fail) => {
		
			(this._ = this.create_http_server ())
				
				.listen (this.conf.listen, x => x ? fail (x) : ok ())
		
		})
	
	}
	
}