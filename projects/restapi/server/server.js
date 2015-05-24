var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');

var hskey = fs.readFileSync('../ssl/hacksparrow-key.pem');
var hscert = fs.readFileSync('../ssl/hacksparrow-cert.pem')

var https_options = {
    key: hskey,
    cert: hscert
};
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.all('/*', function(req, res, next) {
	// CORS headers
	res.header("Access-Control-Allow-Origin", "*"); // Enable Cross Origin Resource Sharing
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});
// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middleware/validateRequest')]);
app.use('/', require('./routes'));
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// Start the server
app.set('port', process.env.PORT || 3000);

server = https.createServer(https_options, app).listen(app.get('port'), function() {
	console.log('Express https server listening on port ' + server.address().port);
});
