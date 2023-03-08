const fs            = require ('fs')
const crypto        = require ('crypto')
const Path          = require ('path')
const {Application} = require ('doix')

const Model          = require ('./Model.js')
const BackService    = require ('./BackService.js')
const PasswordShaker = require ('./PasswordShaker.js')

module.exports = class extends Application {

	constructor (conf, db, logger) {

		const m = new Model (db)

	    super ({
	    	
	    	logger,
	    
			globals: {
				conf,
			    pwd: new PasswordShaker ({path: conf.auth.salt_file}),
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

}