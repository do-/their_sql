const Path = require ('path')
const {Application} = require ('doix')

const BackService = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf, db, logger) {

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

}