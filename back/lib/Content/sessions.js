module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
        let u = await this.db.get ([{users: {
            login: this.rq.data.login,
        }}, 'roles(name)'])

        if (u.is_deleted) throw '#foo#: Вас пускать не велено'
                
        if (u.uuid) {
            if (u.password != await this.session.password_hash (u.salt, this.rq.password)) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.rq.data.login == 'test' && this.rq.password == 'test') {
            u = await this.db.get ([{users: {uuid: '00000000-0000-0000-0000-000000000000'}}, 'roles(name)'])
        }
        else {
            return {}
        }
        
        let user = {
			id    : u.uuid,
			uuid  : u.uuid,
			label : u.label,
			opt   : u.opt,
			role  : u ['roles.name'],
        }
        
		user.opt = await this.db.fold ([

            {'user_options()': {
                is_on: 1,
                id_user: user.uuid
            }},

            'voc_user_options(name)'

        ], (i, d) => {d [i ['voc_user_options.name']] = 1}, {})        

        this.session.user = user
        
        await this.session.start ()

        return {user, timeout: this.session.o.timeout}

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        return this.session.finish ()
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}