const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
                
        this.pools = {
        	db       : this.setup_db (),
            sessions : this.setup_sessions (),
        }

    }

    setup_db () {
    
        let model = new (require ('./Model.js')) ({path: './Model'})

        return Dia.DB.Pool (this.db, model)

    }
    
    setup_sessions () {
    
        return new Dia.Cache ({
        	name: 'session',
        	ttl : this.auth.sessions.timeout * 60 * 1000,
        })

    }

}