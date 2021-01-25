const Async = require ('../../Ext/Dia/Content/Handler/Async.js')

module.exports = class extends Async.Handler {

    constructor (o, resolve, reject) {
    	super (o, resolve, reject)
    	this.import ((require ('./Base')), ['get_method_name', 'get_log_banner', 'db_sign_transaction', 'w2ui_filter'])
    }
    
    async get_user () {    
    	let user = this.user // must be injected 
    	await this.db_sign_transaction ()
        return user
    }

}