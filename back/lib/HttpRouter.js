const odata = require ('./Content/Handler/ODataBackend.js')
const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	create_http_handler (http) {

		let {url, headers} = http.request

		if (/\bodata=/.test (headers.accept)) {

			let {conf} = this, {pools} = conf

			return new odata ({conf, pools, http})

		}

		if (url.match (/^\/(\?|_back)/)) {

			let {conf} = this, {pools} = conf

			return new back ({conf, pools, http})

		}

		return new front ({http})

	}

}