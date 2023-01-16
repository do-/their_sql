const Path = require ('path')

const conf = require (process.argv [2] || Path.join (__dirname, '..', 'conf', 'elud.json'))

module.exports = conf