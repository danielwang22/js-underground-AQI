var http = require("http");

http.createServer(function(request, response) {
  var url = request.url;
  var method = request.method;

  console.log(method, url);
  response.writeHead(200, {"Content-Type": "text/html"});
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888/');
  response.write(
    "<!DOCTYPE html>" + 
    "<html>" +
      "<body>" +
        "<h1>Method: " + method + "</h1>" +
        "<h1>Url: " + url + "</h1>" +
        "<p>Header: " + JSON.stringify(request.headers) + "</p>" +
      "</body>" +
    "</html>");
    
  
  response.end();
}).listen(8888);