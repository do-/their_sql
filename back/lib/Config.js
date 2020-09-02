const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
                
        this.pools = {
        
        	db       : Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),
        	db_o     : Dia.DB.Pool (this.db_o),
        	db_k     : Dia.DB.Pool (this.db_k),
        	db_h     : Dia.DB.Pool (this.db_h),
            
			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
				// algorithm: 'sha256', // <-- default value
				// encoding:  'hex',    // <-- also default; set null to get a Buffer
			}),

        }

    }

	async response (tia, data, pools, user = {}) {

		if (!pools) pools = this.pools

		return new Promise (function (resolve, reject) {

			let h = new (require ('./Content/Handler/Async')) ({user, conf: this, rq: {...tia, ...data}, pools}, resolve, reject)

			setImmediate (() => h.run ())        

		})

	}	
    
    async init () {
    
		let {db} = this.pools
		
		await db.load_schema ()		
		
		let patch = db.gen_sql_patch ()
		
		patch.push ({sql: 'ALTER TABLE IF EXISTS columns_versions DROP CONSTRAINT IF EXISTS columns_versions_id_table_fkey', params: []})
		    	
		if (!patch.length) return
		    	
		return db.run (patch)
		
    }

}