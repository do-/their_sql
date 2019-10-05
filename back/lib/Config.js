const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
                
        this.pools = {
        
        	db       : Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),
        	
            sessions : this.setup_sessions (),
            
        }

    }
    
    setup_sessions () {
    	
    	let s = this.auth.sessions

//  uncomment this unless memcached is available
//    
//      return new (require ('./Ext/Dia/Cache/MapTimer.js')) ({
//      	name: 'session',
//        	ttl : s.timeout * 60 * 1000,
//      })
        
        return new (require ('./Ext/Dia/Cache/Memcached.js')) ({
        	name: 'session',
        	ttl : s.timeout * 60 * 1000,
        	memcached: s.memcached,
        })

    }

}