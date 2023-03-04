const jwt = require ('jsonwebtoken')

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
			
			on: {

				start: job => {
				
					const {cookie} = job.http.request.headers; if (!cookie) return
					
					const sep = '; ', name = 'sid'
					
					const s = sep + cookie + sep, head = sep + name + '='
					
					const pos = s.indexOf (head)
					
					const v = s.substring (pos + head.length, s.indexOf (sep, pos + 1))

					job.user = jwt.verify (v, 'z', {}).sub
				
				},

				end: job => {
				
					const {user, http: {response}} = job

					const sid = jwt.sign ({sub: user}, 'z', {expiresIn: '30m'})

					response.setHeader ('Set-Cookie', 'sid=' + sid + '; HttpOnly')

				},

				error: (job, error) => {

					if (typeof error === 'string') error = Error (error)
					
					while (error.cause) error = error.cause

					const m = /^#(.*?)#:(.*)/.exec (error.message); if (m) {					
						error.field   = m [1]
						error.message = m [2].trim ()
					}
					
					job.error = error

				},

			},

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

	}

}