const Dia = require ('../../Ext/Dia/Dia.js')
const DiaW2uiFilter = require ('../../Ext/Dia/Content/Handler/HTTP/Ext/w2ui/Filter.js')

module.exports = class {

    get_log_banner () {
    	let rq = this.rq
        return [rq.type, rq.action, rq.part, rq.id ? '*' : null].filter (i => i).join ('.')
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

}