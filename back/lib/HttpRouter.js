const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	create_http_handler (http) {

		if (http.request.url.match (/^\/(\?|_back)/)) return new back ({conf: this.conf, pools: this.conf.pools, http})

		return new front ({http})

	}
		
}