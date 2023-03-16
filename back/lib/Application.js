const {Application, PasswordShaker} = require ('doix')
const {DbPoolPg} = require ('doix-db-postgresql')

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

		this.ext = Object.fromEntries (conf.src.map (db => [db.id, new DbPoolPg ({db, logger: log (db.id)})]))

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