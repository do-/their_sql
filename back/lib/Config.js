const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
                
        this.pools = {
        
        	db       : Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),
        	db_o     : Dia.DB.Pool (this.db_o),

            sessions : this.setup_sessions (),
            
			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
				// algorithm: 'sha256', // <-- default value
				// encoding:  'hex',    // <-- also default; set null to get a Buffer
			}),

        }

    }
    
    setup_sessions () {
    	
    	let s = this.auth.sessions

		return new (require ('./Ext/Dia/Cache/MapTimer.js')) ({
	      	name: 'session',
        	ttl : s.timeout * 60 * 1000,
		})

    }
    
    async init () {
    
		let db = this.pools.db
		
		await db.load_schema ()
		
		await db.update_model ()
		
    }

}