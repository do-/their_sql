const Path         = require ('path')
const {HttpRouter} = require ('doix-http')

const {DbQuery}    = require ('doix-db')
const {DbPoolPg}   = require ('doix-db-postgresql')
const w2ui         = require ('doix-w2ui')

const conf         = require ('./lib/Conf.js')
const createLogger = require ('./lib/Logger.js')
const Application  = require ('./lib/Application.js')

const appLogger = createLogger (conf, 'app')

const db  = new DbPoolPg ({
	db     : conf.db,
	logger : createLogger (conf, 'db'),
})

w2ui.plugInto (db)

DbQuery.prototype.eluGrid = function (list) {

	return {
		[this.tables [0].alias]: list, 
		cnt: list [Symbol.for ('count')], 
		portion: this.options.limit,
	}

}

const app = new Application (conf, db, appLogger)

app.init ().then (() => {

	const {listen} = conf;

	new HttpRouter ({listen, logger: appLogger})
		.add (app.createBackService ())
		.listen ()

})