var express = require('express');
var app = express();
const router = express.Router()
var mysql = require('mysql');
const date = require('date-and-time');
var connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imdb'
  }
)
connection.connect();


app.set('view engine', 'ejs');


app.use(express.urlencoded());



app.get('/', function(req, res) {
  connection.query('SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid ORDER BY movies.movie_name', function(err, result, fields) {
    if (err) throw err;
    res.render('pages/index', {
      res: result
    });
  });
});

app.post('/details', function(req, res) {
  connection.query(`SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid WHERE movies.movieid = ${req.body.id} ORDER BY movies.movie_name`, function(err, result, fields) {
    if (err) throw err;
    console.log(result[0].movie_name)

    connection.query(`SELECT people.person_name, people.birth_date, people.path_to_img, roles.person_role,  roles.role_as FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.movieid = ${result[0].movieid}`, function (err, result2, fields) {
      if (err) throw err;
      console.dir(result2);
      res.render('pages/details', {
        movie: result[0],
        cast: result2,
        date: date
      })
    })

  })
})

app.post('/search', function(req, res) {
  console.log(req.body.input)
  connection.query(`SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid WHERE movies.movie_name LIKE "%${req.body.input}%" ORDER BY movies.movie_name`, function(err, result, fields) {
    if (err) throw err;
    res.render('pages/index', {
      res: result
    })
  })
});

app.post('/login', function(req, res) {
  console.log(req.body.user_email + " " + req.body.user_passwd)
  res.redirect('/')
});

app.use( express.static( "public" ) );

app.listen(8080);


console.log('Server is listening on port 8080');