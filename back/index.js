const Path         = require ('path')
const {HttpRouter} = require ('doix-http')

const {DbPoolPg} = require ('doix-db-postgresql')

const conf         = require ('./lib/Conf.js')
const createLogger = require ('./lib/Logger.js')
const Application  = require ('./lib/Application.js')

const appLogger = createLogger (conf, 'app')

const db  = new DbPoolPg ({
	db     : conf.db,
	logger : createLogger (conf, 'db'),
})

const app = new Application (conf, db, appLogger)

const {listen} = conf; new HttpRouter ({listen, logger: appLogger})
	.add (app.createBackService ())
	.listen ()