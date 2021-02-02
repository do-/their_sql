const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.Config {

    constructor () {
    
    	super ()

        this.pools = {

        	db: Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),

			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
				// algorithm: 'sha256', // <-- default value
				// encoding:  'hex',    // <-- also default; set null to get a Buffer
			}),

        }

        this.ext_pools = {}; for (let s of this.src) {
        
        	let {connectionString} = s
        
        	s.pool = Dia.DB.Pool ({connectionString})
        	
        	for (let k of s.id.split ('|')) this.ext_pools [k] = s.pool
        
        }

    }

	async response (tia, data, pools, user = {}) {

		if (!pools) pools = this.pools

		return new Promise ((resolve, reject) => {

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