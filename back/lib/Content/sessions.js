module.exports = {

allowAnonymous: true,

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
    	const {app, db, rq: {data: {login}}} = this
    	
    	const password = this.http.request.headers ['x-request-param-password']

    	const u = await db.getObject ('SELECT * FROM users WHERE login = ?', [login])

        if (u.is_deleted) throw '#foo#: Вас пускать не велено'

        if (u.uuid) {

            if (!this.pwd.test (u.password, password, u.salt)) return {}

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
			opt   : {},
			role  : db.model.map.get ('roles').data.find (i => i.id == u.id_role).name,
        }
        
		const opt = await db.getArray (`
			SELECT
				v.name
			FROM
				user_options t
				JOIN voc_user_options v ON v.id = t.id_voc_user_option
			WHERE
				t.is_on = 1
				AND t.id_user = ?
		`, [user.uuid], {rowMode: 'scalar'})

		for (const k of opt) user.opt [k] = 1

		this.user = user

        return {user, timeout: this.conf.auth.sessions.ttl}

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        this.user = null
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}