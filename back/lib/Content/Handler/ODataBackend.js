const Dia = require ('../../Ext/Dia/Dia.js')
const Session = require ('./HTTP/Session.js')
const URL  = require ('url')
const ODataFilter = require ('../../Ext/Dia/Content/Handler/HTTP/Ext/odata/Filter.js')

module.exports = class extends Dia.HTTP.Handler {
    
    w2ui_filter () {return new ODataFilter (this.rq)}

    constructor (o) {
    	super (o)
    	this.import ((require ('./Base')), ['get_method_name', 'get_log_banner', 'db_sign_transaction'])
    }

    async read_params () {
    
		await super.read_params ()
		
		let {rq, http} = this

		if (!rq.type) rq.type = URL.parse (http.request.url).pathname.split ('/').filter (i => i).pop ()

	}
	
    send_out_json (code, data) {
        this.http.response.setHeader ('Access-Control-Allow-Origin', '*')
        super.send_out_json (code, data)
    }
	
	to_message (d) {
	
		if ('cnt' in d && 'portion' in d) {
		
			delete d.portion
			
			let {cnt} = d; delete d.cnt
			
			for (let results of Object.values (d)) 
			
				if (Array.isArray (results)) 
				
					return {d: {__count: cnt, results}}
			
		}
	
		return {d}
	
	}

    check () {
        super.check ()
        let m = this.http.request.method
//        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    get_session () {
		return new Session (this, this.conf.auth.sessions)
    }

    is_anonymous () {
return true
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }

    get_method_name () {
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    async get_user () {
        
        let user = await super.get_user (), {type, action, id} = this.rq

        if (!this.is_transactional () || !user) return user

        this.user = user

    	await this.db_sign_transaction ()
        
        return user
        
    }

}