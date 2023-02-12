const {WebService, HttpParamReader, HttpResultWriter} = require ('doix-http')

const QUERY = Symbol.for ('query')
const COUNT = Symbol.for ('count')

module.exports = class extends WebService {

	constructor (app, o = {}) {
	
	    super (app, {
	    
			methods: ['POST'],

			reader: new HttpParamReader ({
				from: {
					searchParams: true,
					bodyString: s => JSON.parse (s),	
				}
			}),

			writer: new HttpResultWriter ({

				type: 'application/json',

				stringify: content => {

					if (COUNT in content) content = {
						[content [QUERY].tables [0].alias]: content,
						cnt: content [COUNT],
						portion: content [QUERY].options.limit,
					}				
				
					return JSON.stringify ({
						success: true, 
						content, 
					})
				
				}

			}),

			dumper: new HttpResultWriter ({
				code: e => 500,
				type: 'application/json',
				stringify: (err, job) => JSON.stringify ({
					success: false, 
					id: job.uuid,
					dt: new Date ().toJSON ()
				})
			}),
			
			...o

	    })

	}

}