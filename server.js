process.addListener('uncaughtException', function(err, stack){
  console.log("-----------------");
  console.log("Exception: " + err);
  console.log(err.stack);
  console.log("-----------------");
});

var ContentParser = require('./lib/contentparser');

new ContentParser({
    port: 8000
  , website: {
        host: 'www.rgu.de'
      , port: 80
      , requestMethod: 'GET'
      , path: '/'
    }
  , parser: {
        verbose: false
      , ignoreWhitespace: true 
    }
});
