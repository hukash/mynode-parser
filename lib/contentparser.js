var sys = require('sys'),
    http = require('http'),
    htmlparser = require('htmlparser');

function ContentParser(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.settings = {
    port: options.port,
    website: {
        host: options.website.host
      , port: options.website.port || 80
      , requestMethod: options.website.method || 'GET'
      , path: options.website.path || '/'
    }
  };

  self.init();

};

ContentParser.prototype.init = function() {
  var self = this;

  self.httpRequest = self.createHTTPRequest();
  sys.log('Client started to parse ' + self.settings.website.host + 
          ' on port: ' + self.settings.website.port);
  
  // Parser, should be an extra prototype function
  self.httpRequest.end();

  var handler = new htmlparser.DefaultHandler(function (err, dom) {
    if (err) { sys.puts(err); }
  }
  , { verbose: false, ignoreWhitespace:true });

  var parser = new htmlparser.Parser(handler);

  self.httpRequest.on('response', function(response) {
    response.setEncoding('utf8');

    response.on('data', function(chunk){
      parser.parseChunk(chunk);
      
      var text = htmlparser.DomUtils.getElementsByTagType(
        'text', handler.dom);
      
      sys.puts(sys.inspect(text, false, null));
    });
  });
};

ContentParser.prototype.createHTTPRequest = function() {
  var self = this;
  
  var client = http.createClient(
          self.settings.website.port
        , self.settings.website.host
  );
  
  var request = client.request(
          self.settings.website.requestMethod 
        , self.settings.website.path
        , { 'host': self.settings.website.host }
  );

  return request;
};

module.exports = ContentParser;
