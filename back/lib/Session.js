const {Cookie} = require ('doix-http')
const jwt = require ('jsonwebtoken')

class Session extends Cookie {
	
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