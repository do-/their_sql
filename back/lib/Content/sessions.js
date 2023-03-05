module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
    	const {app, db, rq: {data: {login}}} = this
    	
    	const password = this.http.request.headers ['x-request-param-password']

    	const u = await db.getObject ('SELECT * FROM users WHERE login = ?', [login])

        if (u.is_deleted) throw '#foo#: Вас пускать не велено'
                
        if (u.uuid) {
            if (u.password != app.pwdHash (password, u.salt)) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.rq.data.login == 'test' && this.rq.password == 'test') {
            u = await await db.getObject ('users', '00000000-0000-0000-0000-000000000000')
        }
        else {
            return {}
        }

        let user = {
			id    : u.uuid,
			uuid  : u.uuid,
			label : u.label,
			opt   : u.opt,
			role  : db.model.map.get ('roles').data.find (i => i.id == u.id_role).name,
        }
        
		user.opt = {}/*await this.db.fold ([

            {'user_options()': {
                is_on: 1,
                id_user: user.uuid
            }},

            'voc_user_options(name)'

        ], (i, d) => {d [i ['voc_user_options.name']] = 1}, {})        

        this.session.user = user
        
        await this.session.start ()
*/

		this.user = user

        return {user, timeout: 60/*this.session.o.timeout*/}

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        this.user = null
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}