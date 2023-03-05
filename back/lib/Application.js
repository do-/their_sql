const fs            = require ('fs')
const crypto        = require ('crypto')
const Path          = require ('path')
const {Application} = require ('doix')

const Model         = require ('./Model.js')
const BackService   = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf, db, logger) {

		const m = new Model (db)

	    super ({
	    	
	    	logger,
	    
			globals: {
				conf,
			},

			pools: {
				db,
			},

			modules: {
				dir: {
					root: [
						__dirname,
					],
					filter: (str, arr) => arr.at (-1) === 'Content',
//					live: true,
				},
				watch: true,
			},

	    })
	    
	}
	
	createBackService () {
	
		const {sessions} = this.globals.get ('conf').auth
	
		return new BackService (this, {sessions})
	
	}
	
	async init () {
	
		const job = this.createJob ()
		
		job.rq = {type: 'app', action: 'init'}
		
		await job.toComplete ()
	
	}
	
	pwdHash (password, salt) {
		
		const hash = crypto.createHash ('sha256')
		
		hash.update (fs.readFileSync (this.globals.get ('conf').auth.salt_file, 'utf8'))

		if (salt != null) hash.update (salt)
		
		hash.update (String (password), 'utf8')

		return hash.digest ('hex')

	}

}