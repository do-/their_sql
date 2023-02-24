const Path          = require ('path')
const {Application} = require ('doix')

const Model         = require ('./Model.js')
const BackService   = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf, db, logger) {
	
		const m = new Model (db)
		m.loadModules ()

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
	
	createBackService (o) {
	
		return new BackService (this, o)
	
	}
	
	async init () {
	
		const job = this.createJob ()
		
		job.rq = {type: 'app', action: 'init'}
		
		await job.toComplete ()
	
	}

}