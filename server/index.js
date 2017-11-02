var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.listen(4000, function() {
  console.log('listening on port 4000!');
});
