const jwt = require ('jsonwebtoken')

const SEP = '; '

class Session {

	constructor (webService, o = {}) {
		
		this.name = o.name || 'sid'

		this.ttl  = o.ttl  ||  30
	
	}

	getRaw (request) {

		const {cookie} = request.headers; if (!cookie) return null

		const 
			{name} = this, 
			s      = SEP + cookie + SEP, 
			head   = SEP + name + '=',
			pos    = s.indexOf (head)

		return s.substring (pos + head.length, s.indexOf (SEP, pos + 1))

	}

	setRaw (response, value) {

		response.setHeader ('Set-Cookie', this.name + '=' + value + '; HttpOnly')

	}
	
	read (job) {

		const v = this.getRaw (job.http.request); if (!v) return

		job.user = jwt.verify (v, 'z', {}).sub

	}

	save (job) {

		const {user, http: {response}} = job

		const value = jwt.sign ({sub: user}, 'z', {expiresIn: this.ttl + 'm'})
		
		this.setRaw (response, value)

	}

}

module.exports = Session