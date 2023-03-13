const {DbPoolPg} = require ('doix-db-postgresql')
const w2ui       = require ('doix-w2ui')
const Model      = require ('./Model.js')

module.exports = class extends DbPoolPg {

	constructor (db, logger) {

		super ({db, logger})

		w2ui.plugInto (this)

		new Model (this)

	}

}