const {DbModel} = require ('doix-db')

module.exports = class extends DbModel {

    constructor (db) {

        super ({
			db,
			dir: {root: [__dirname], filter: (str, arr) => arr.at (-1) === 'Model'},
		})
		
		this.loadModules ()
		
        this.addVersioning ()

	}
	
	getFields (relationName) {

		const o = {}, {columns} = this.map.get (relationName)
		
		for (const {name, type, comment} of Object.values (columns)) o [name] = {
			name, 
			"REMARK": comment, 
			"TYPE_NAME": type,
		}
			
		return o

	}
	

	addVersioning () {
	
		const K = '_versions', {map} = this
		
		const _versions = map.get (K); map.delete (K)
		
		for (const table of map.values ()) 
		
			if ('log' in table)
			
				_versions.add_to (table)
		
	}


}