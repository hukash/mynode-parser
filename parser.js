var sys = require('sys'),
    http = require('http'),
    htmlparser = require('htmlparser');

var website = http.createClient(80, 'www.rgu.de'),
    request = website.request('GET', '/', {'host': 'www.rgu.de'});
request.end();

var counter = 0;
var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error) { sys.puts(counter++ + " " + error); }
    else { sys.puts("OK"); }
  } 
  , { verbose: false, ignoreWhitespace:true });

var parser = new htmlparser.Parser(handler);

request.on('response', function(response) {
  response.setEncoding('utf8');
  
  response.on('data', function (chunk) {
    parser.parseChunk(chunk);
    var text = htmlparser.DomUtils.getElementsByTagType("text", handler.dom);
    // shows the whole site
    //sys.puts(sys.inspect(handler.dom, false, null));
    sys.puts("text: " + sys.inspect(text, false, null));
  });
});
