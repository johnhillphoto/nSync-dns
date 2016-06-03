//we need our database


var http = require('http');


function createServer(){
  var port = process.env.PORT || 3000;
  /* a server needs to know what responses to send to
     what requests - our express app knows how to
     handle requests and responses -- so it will
     handle that */
  http.createServer(require('./app'))
    .listen(port, function(){
      console.log('server started ' + port);
    });
}

createServer();
