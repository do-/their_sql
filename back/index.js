const Path         = require ('path')
const {HttpRouter} = require ('doix-http')

const {DbQuery}    = require ('doix-db')
const {DbPoolPg}   = require ('doix-db-postgresql')

const conf         = require ('./lib/Conf.js')
const createLogger = require ('./lib/Logger.js')
const Application  = require ('./lib/Application.js')

const appLogger = createLogger (conf, 'app')

const db  = new DbPoolPg ({
	db     : conf.db,
	logger : createLogger (conf, 'db'),
})

db.w2uiQuery = function (from, options = {}) {

	const {rq} = this.job

	for (const k of ['offset', 'limit'])

		options [k] = rq [k]
		
	if (rq.sort) 
	
		options.order = rq.sort.map (o => [o.field, o.direction === 'desc'])

	const query = this.model.createQuery (from, options)

	return query

}
db.shared.add ('w2uiQuery')


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