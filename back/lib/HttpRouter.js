const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	create_http_handler (http) {
	
		let {url} = http.request

		if (url.match (/^\/(\?|_back)/)) {
		
			let {conf} = this, {pools} = conf
				
			return new back ({conf, pools, http})
		
		}

		return new front ({http})

	}
		
}