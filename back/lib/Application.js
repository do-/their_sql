const Path = require ('path')
const {Application} = require ('doix')
const {DbObjectMap} = require ('doix-db')

const BackService = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf, db, logger) {
	
		const map = new DbObjectMap ({
			dir: {
				root: [
					__dirname,
				],
				filter: (str, arr) => arr.at (-1) === 'Model',
			},
		})
		
		map.load ()
		
		db.model = {map}

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