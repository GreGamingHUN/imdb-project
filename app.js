var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imdb'
  }
)
connection.connect();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  connection.query('SELECT * FROM movies', function(err, result, fields) {
    if (err) throw err;
    res.render('pages/index', {
      res: result
    });
  });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.use( express.static( "public" ) );

app.listen(8080);


console.log('Server is listening on port 8080');