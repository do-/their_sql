const fs     = require ('fs')
const crypto = require ('crypto')

module.exports = class extends require ('../../../Ext/Dia/Content/Handler/HTTP/Session/JWTCookieSession.js') {

	async password_hash (salt, password) {
	
		return this.h.pwd_calc.encrypt (password, salt)
    
    }

}