const Dia = require ('../../Ext/Dia/Dia.js')
const Session = require ('./HTTP/Session.js')

module.exports = class extends Dia.HTTP.Handler {
    
    constructor (o, resolve, reject) {
    	super (o, resolve, reject)
    	this.import ((require ('./Base')), ['get_method_name', 'get_log_banner', 'db_sign_transaction', 'w2ui_filter'])
    }

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    get_session () {
		return new Session (this, this.conf.auth.sessions)
    }

    is_anonymous () {
        return true//this.rq.type == 'sessions' && this.rq.action == 'create'
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