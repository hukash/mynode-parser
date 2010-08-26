var sys = require('sys'),
    htmlparser = require('htmlparser');

var rawHTML = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";

var handler = new htmlparser.DefaultHandler(function (error, dom) {
  if (error) { sys.puts("Error"); }
  else { sys.puts("OK"); }
});


var parser = new htmlparser.Parser(handler);
parser.parseComplete(rawHTML);
sys.puts(sys.inspect(handler.dom, false, null));
