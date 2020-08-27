const fs = require ('fs')
const {Readable} = require ('stream')

module.exports = {

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_kapital_imports: 

    async function () {
        
        return this.db.get ({kapital_imports: this.rq.id})

    },
    

////////////////////////////////////////////////////////////////////////////////

do_create_kapital_imports:

    async function () {
    
    	let uuid = this.rq.id
            
        await this.db.insert_if_absent ('kapital_imports', {uuid})
        
        setImmediate (() => this.conf.response ({type: 'kapital_imports', id: uuid, action: 'execute'}, {}, null, this.user))
        
        return uuid

    },


////////////////////////////////////////////////////////////////////////////////

do_execute_kapital_imports:

    async function () {
    
    	let {db} = this

        await db.do ('SELECT copy_from_kapital()')    
    
    	let n2s = {}, root = '../../../kapital/', js = 'back.js/lib/Model/kapital/', pm = 'back/lib/Model/' //root = '../../../kapital/back.js/lib/Model/kapital/'
    	
		for (let fn of fs.readdirSync (root + pm)) {
		
			let n = fn.replace ('.pm', '')
			
			n2s ['k.' + n] = pm + fn

		}

    	for (let dir of fs.readdirSync (root + js)) {

			for (let fn of fs.readdirSync (root + js + dir)) {
			
				let n = fn.replace ('.js', '')
				
				if (/\./.test (n)) continue

				n2s ['k.' + n] = js + dir + '/' + fn

			}

    	}
    	        
		let cols = ['id', 'path']

		let tmp = await db.create_temp_as ('tables', cols)
	    	
		await db.load (Readable.from (Object.entries (n2s).map (([id, path]) => ({id, path}))), tmp, cols)

		await Promise.all ([
		
			`UPDATE tables t SET path = b.path FROM ${tmp} b WHERE t.id = b.id`,
			
			`UPDATE tables   SET path = NULL                 WHERE id NOT IN (SELECT id FROM ${tmp})`,
		
		].map (sql => db.do (sql)))

    	await db.do ('UPDATE kapital_imports SET is_over = 1 WHERE uuid = ?', [this.rq.id])

    },

}