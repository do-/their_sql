const fs     = require ('fs')
const crypto = require ('crypto')

module.exports = class extends require ('../../../Ext/Dia/Content/Handler/HTTP/Session/CachedCookieSession.js') {

	async password_hash (salt, password) {
    
		let hash   = crypto.createHash ('sha256')

        let input  = fs.createReadStream (this.h.conf.auth.salt_file)

        return new Promise ((resolve, reject) => {

            input.on ('error', reject)

            input.on ('end', () => {
                hash.update (String (salt))
                hash.update (String (password), 'utf8')
                resolve (hash.digest ('hex'))
            })

            input.pipe (hash, {end: false})

        })

    }

}