const {Application, PasswordShaker} = require ('doix')

const createLogger                  = require ('./Logger.js')
const DB                            = require ('./DB.js')
const BackService                   = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf) {
	
		const log = name => createLogger (conf, name)

	    super ({
	    	
	    	logger: log ('app'),
	    
			globals: {
				conf,
			    pwd: new PasswordShaker ({path: conf.auth.salt_file}),
			},

			pools: {
				db: new DB (conf.db, log ('db')),
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

}