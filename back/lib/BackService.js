const {WebService, HttpParamReader, HttpResultWriter} = require ('doix-http')
const {CookieRedis} = require ('doix-http-cookie-redis')

const QUERY = Symbol.for ('query')
const COUNT = Symbol.for ('count')

module.exports = class extends WebService {

	constructor (app, o) {
		
	    super (app, {
	    
			methods: ['POST'],

			reader: new HttpParamReader ({
				from: {
					searchParams: true,
					bodyString: s => JSON.parse (s),	
				}
			}),
			
			on: {

				error : (job, error) => {

					if (typeof error === 'string') error = Error (error)
					
					while (error.cause) error = error.cause

					const m = /^#(.*?)#:(.*)/.exec (error.message); if (m) {					
						error.field   = m [1]
						error.message = m [2].trim ()
					}
					
					job.error = error

				},

			},

			writer: new HttpResultWriter ({

				type: 'application/json',

				stringify: content => {

					if (Array.isArray (content) && COUNT in content) content = {
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
				code: err => 'field' in err ? 422 : 500,
				type: 'application/json',
				stringify: (err, job) => JSON.stringify (
					'field' in err ? {
						field: err.field,
						message: err.message
					}
					: {
						success: false,
						id: job.uuid,
						dt: new Date ().toJSON ()
					}					
				)
				
			}),
			
			...o

	    })

	    new CookieRedis ({prefix: 'session_', ...o.sessions}).plugInto (this)

	}

}