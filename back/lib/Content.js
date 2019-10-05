module.exports.create_http_server = function (conf) {

    require ('http')
    
        .createServer (
        
            (request, response) => {new (require ('./Content/Handler/WebUiBackend.js')) ({
            
                conf, 
                
                pools: conf.pools, 
                
                http: {request, response}
                
            }).run ()}

        )
        
        .listen (
        
            conf.listen, 
            
            function () {
                darn ('default app is listening to HTTP at ' + this._connectionKey)
            }
        
        )

}