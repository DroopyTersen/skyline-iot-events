// This an example of an Express server you could use to allow devices 
// to trigger events with an HTTP POST (in case they can't run javascript)
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var server = require('http').Server(app);

var iotEvents = require("skyline-iot-events");

app.use(bodyParser.json());    

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hi there');
});

// EXAMPLE POST
// http://skylineiot.azurewebsites.net/trigger
// Headers: { Content-Type: application/json }
// { 
//     "key": "toggleRobotMotor", 
//     "payload": {
//         "action": "forward",
//         "source": "andrew"
//     }
// }
app.post('/trigger', function(req, res) {
	if (req.body && req.body.key && req.body.payload) {
		iotEvents.trigger(req.body.key, req.body.payload);
		res.send("success");

	} else {
		res.send("fail");
	}
});

var port = process.env.PORT || 4000;
var host = process.env.IP;
if (host) {
	server.listen(port, host, function() {
  		console.log('Server listening on port ' + host + ":" + port);
	});
} else {
	server.listen(port, host, function() {
  		console.log('Server listening on port ' + port);
	});
}