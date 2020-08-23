const Dia = require ('../../Ext/Dia/Dia.js')
const Session = require ('./HTTP/Session.js')
const DiaW2uiFilter = require ('../../Ext/Dia/Content/Handler/HTTP/Ext/w2ui/Filter.js')

module.exports = class extends Dia.HTTP.Handler {
    
    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    get_session () {

    	let h = this
    	let p = h.pools

    	return new Session (h, {
    		sessions:    p.sessions,
    		cookie_name: h.conf.auth.sessions.cookie_name || 'sid',
    	})

    }

    is_anonymous () {
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }

    get_method_name () {
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    w2ui_filter () {return new DiaW2uiFilter (this.rq)}
    
    async db_sign_transaction () {

        return this.db.do ("SELECT set_config ('their_sql.request', ?, true)", [JSON.stringify ({

        	_id_rq:     this.uuid,

        	_id_user:   (this.user || {}).id,

        	_type:      this.rq.type,

        	_id:        this.rq.id,

        	_action:    this.rq.action,

        })])

    }

    async get_user () {
        
        let user = await super.get_user (), {type, action, id} = this.rq

        if (!this.is_transactional () || !user) return user

        this.user = user

    	await this.db_sign_transaction ()
        
        return user
        
    }

}