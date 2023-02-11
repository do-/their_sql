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

/*
const OPS = new Map ([
	['contains', 'ILIKE']
])
*/

db.w2uiQuery = function (from, options = {}) {

	const {rq} = this.job, {sort, search} = rq

	for (const k of ['offset', 'limit'])

		options [k] = rq [k]
		
	if (sort) options.order = sort.map (o => [o.field, o.direction === 'desc'])

	const query = this.model.createQuery (from, options), table = query.tables [0]
	
	if (search) {
	
		const table = query.tables [0]
	
		for (const {field, type, operator, value} of search) switch (operator) {

			case 'contains':
				table.addColumnComparison (field, 'ILIKE', '%' + value + '%')
				break

			default:
				throw 'Unknown operator: ' + operator

		}
	
	}

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