var sys = require('sys'),
    http = require('http'),
    htmlparser = require('htmlparser');

function ContentParser(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.settings = {
      port: options.port
    , website: {
          host: options.website.host
        , port: options.website.port || 80
        , requestMethod: options.website.method || 'GET'
        , path: options.website.path || '/'
      }
    , parser: {
          verbose: options.parser.verbose || false
        , ignoreWhitespace: options.parser.whitespace || true
    }
  };

  self.init();

};

ContentParser.prototype.init = function() {
  var self = this;

  self.httpRequest = self.createHTTPRequest();
  sys.log('Client started to parse ' + self.settings.website.host + 
          ' on port: ' + self.settings.website.port);
  
  self.httpRequest.end();

  self.httpRequest.on('response', function(response) {
    response.setEncoding('utf8');

    self.parserJSON = self.createParser();
    var parser = self.parserJSON.contentParser,
        handler = self.parserJSON.contentHandler;

      response.on('data', function(chunk) {
        parser.parseChunk(chunk);

        // selectors 
        var content = htmlparser.DomUtils.getElementsByTagName(
          'p', handler.dom);
        content = htmlparser.DomUtils.getElementsByTagType(
          'text', content);

        sys.puts(sys.inspect(content, false, null));
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

ContentParser.prototype.createParser = function() {
  var self = this;

  var handler = new htmlparser.DefaultHandler(
      function(err, dom) {
        if (err) { sys.puts(err); } }
    , { 
        verbose: self.settings.parser.verbose
      , ignoreWhitespace: self.settings.parser.whitespace
      }
  );
  var parser = new htmlparser.Parser(handler);

  return parser = {
      contentParser: parser
    , contentHandler: handler 
  };
};

module.exports = ContentParser;
