module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_init_app: 

    async function () {
    
    	const {db} = this, {model, lang} = db

    	for (const [sql, params] of lang.genDDL (model)) await db.do (sql, params)

    },
    
}