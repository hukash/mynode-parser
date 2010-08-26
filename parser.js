var sys = require('sys'),
    http = require('http'),
    htmlparser = require('htmlparser');

var website = http.createClient(80, 'www.heise.de');
var request = website.request('GET', '/', {'host': 'www.heise.de'});
request.end();

request.on('response', function (response) {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

var rawHTML = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";

var handler = new htmlparser.DefaultHandler(function (error, dom) {
  if (error) { sys.puts("Error"); }
  else { sys.puts("OK"); }
});


var parser = new htmlparser.Parser(handler);
parser.parseComplete(rawHTML);
sys.puts(sys.inspect(handler.dom, false, null));
