var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var apiEndPoint = require('./app/routes/api/index');
var appEndPoint = require('./app/routes/app/index');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api', apiEndPoint)
app.use('/app', appEndPoint)

app.set('view engine', 'pug');
app.use(express.static('public'))

app.get('/test', function(req, res, next) {
	res.render('test', { rooturl: 'http://localhost:8080/' });
});

app.get('/ping', (req,res) => {
	res.end("pong")
})

var port = 5000;

app.listen(port, function(){
	console.log(`listening on *:${port}`);
});