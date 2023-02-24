const {DbModel} = require ('doix-db')

module.exports = class extends DbModel {

    constructor (db) {

        super ({
			db,
			dir: {root: [__dirname], filter: (str, arr) => arr.at (-1) === 'Model'},
		})

//        this.add_versioning ()

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
	
/*
	add_versioning () {

    	let {_versions} = this.tables; delete this.tables._versions

    	for (let table of Object.values (this.tables)) 
    	
    		if (table.log) 

    			_versions.add_to.call (_versions, table)
    			
	}
*/

}