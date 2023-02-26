const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_users: 

    function () {

    	const {conf, db: {model}, rq: {type}} = this

		const data = {
		
			_fields: model.getFields (type),
				
		}
		
		for (const k of ['roles']) data [k] = model.map.get (k).data

		return data

    },
    
////////////////////////////////////////////////////////////////////////////////

select_users:
    
    function () {

    	const {db, rq} = this
    	
        if (rq.searchLogic === 'OR') {

            const {value} = rq.search [0]

            rq.search = ['label', 'login', 'mail'].map (field => ({field, operator: 'contains', value}))

        }

		return db.getArray (db.w2uiQuery (
			[
				['users', {
					filters: [
						['uuid', '<>', '00000000-0000-0000-0000-000000000000'],
						['is_deleted', '=', 0],
					]
				}],
				['roles', {as: 'role'}]
			], 
			{order: ['label']}
		))

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_users: 

    async function () {

    	const {db, rq: {id, type}} = this

		const data = await db.getObject (db.w2uiQuery (
			[
				['users', {
					filters: [['uuid', '=', id]]
				}],
				['roles', {as: 'role'}]
			], 
		))

        data._fields = db.model.getFields (type)
        
        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

get_options_of_users: 

    async function () {

    	const {db, rq: {id, type}} = this

    	const q = db.model.createQuery ([
			['voc_user_options'],
			['user_options', {
				join    : 'LEFT',
				on      : 'user_options.id_voc_user_option = voc_user_options.id',
				filters : [['id_user', '=', id]],
			}],
    	])

    	const voc_user_options = await db.getArray (q)
    	
    	return {voc_user_options}
        
//        let filter = {'roles... LIKE': `% ${user['roles.name']} %`}
        
    },
    
////////////////////////////////////////////////////////////////////////////////

do_set_option_users: 

    async function () {
    
        if (this.user.role != 'admin') throw '#foo#:Доступ запрещён'

        let d = {
            id_user: this.rq.id,
            uuid: Dia.new_uuid ()	// Caution! DON'T replicate this line!
            	
									// This is only a hack to allow dual PostreSQL / SQLite compatibility

									// for PostreSQL, better decalre uuid=uuid_generate_v4()
									// for SQLite, it mysteriously works with NULL uuids

        }
        
        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.rq.data [k]
        
        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])
        
    },

////////////////////////////////////////////////////////////////////////////////

do_set_own_option_users: 

    async function () {

        let voc_user_option = this.db.get ([{voc_user_options: {id: this.rq.data.id_voc_user_option}}]);

        if (!voc_user_option.is_own) throw '#foo#:Доступ запрещён'

        let d = {
            id_user: this.user.id
        }

        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.rq.data [k]

        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])

    },
    
////////////////////////////////////////////////////////////////////////////////

get_own_options_of_users: 

    async function () {

        let filter = this.w2ui_filter ()
        delete filter.LIMIT
        filter ['roles... LIKE'] = `% ${this.user.role} %`
        filter.is_own = 1
        
        return await this.db.add ({}, [{voc_user_options: filter},
            {'user_options(is_on)': {
                id_user: this.user.uuid,
            }}
        ])

    },    
    
////////////////////////////////////////////////////////////////////////////////

do_set_password_users: 

    async function () {

        if (this.rq.p1 == undefined) throw '#p1#: Получено пустое значение пароля'
        if (this.rq.p1 != this.rq.p2) throw '#p2#: Повторное значение пароля не сходится'
darn (this.user)
        let uuid = 
                   this.user.role == 'admin' ? this.rq.id || this.user.uuid : 
                   this.user.uuid

        let salt     = await this.session.password_hash (Math.random (), new Date ().toJSON ())
        let password = await this.session.password_hash (salt, this.rq.p1)

        return this.db.update ('users', {uuid, salt, password})

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_users: 

    async function () {
    
        this.db.update ('users', {
            uuid        : this.rq.id, 
            is_deleted  : 1, 
        })

    },

////////////////////////////////////////////////////////////////////////////////

do_update_users: 

    async function () {
    
        let data = this.rq.data

        let uuid = this.rq.id

        let d = {uuid}

        for (let k of ['login', 'label', 'mail']) d [k] = data [k]
        
        try {
            await this.db.update ('users', d)
        }
        catch (x) {
            throw x.cause?.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }

    },

////////////////////////////////////////////////////////////////////////////////

do_create_users:

    async function () {
    
        let data = this.rq.data
            
        if (!data.id_role) throw '#id_role#: Не указана роль'

        let d = {uuid: this.rq.id}

        for (let k of ['login', 'label', 'id_role']) d [k] = data [k]        
        
        try {
            await this.db.insert ('users', d)
        }
        catch (x) {
            throw x.cause?.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }
        
        return d

    },

}