var express = require('express');
var app = express();
const router = express.Router()
var mysql = require('mysql');
const date = require('date-and-time');
const crypto = require('crypto');
const { localsName } = require('ejs');
const { Console } = require('console');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

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


let alert = "";
app.get('/', function(req, res) {
  console.log(localStorage.getItem('username'))
  console.log(localStorage.getItem('loggedin'))
  connection.query('SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid ORDER BY movies.movie_name', function(err, result, fields) {
    if (err) throw err;

    connection.query(`SELECT movieid FROM favourites WHERE username = "${localStorage.getItem('username')}"`, function(err, result2, fields) {
      console.dir(result2);
      res.render('pages/index', {
        res: result,
        localStorage: localStorage,
        res2: result2,
        alert: alert
      });
      alert = "";
    })
    
  })
});

app.get('/people', function(req, res) {
  connection.query(`SELECT person_name, path_to_img FROM people`, function(err, result, fields) {
    res.render('pages/people', {
      people: result
    });
  })
})

app.get('/addperson', function(req, res) {
  res.render('pages/addperson.ejs');
})

app.post('/search', function(req, res) {
  console.log(req.body.input)
  connection.query(`SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid WHERE movies.movie_name LIKE "%${req.body.input}%" ORDER BY movies.movie_name`, function(err, result, fields) {
    if (err) throw err;
    connection.query(`SELECT movieid FROM favourites WHERE username = "${localStorage.getItem('username')}"`, function(err, result2, fields) {
      res.render('pages/index', {
        res: result,
        localStorage: localStorage,
        res2: result2,
        alert: alert
      })
    })
  })
});

app.post('/details', function(req, res) {
  connection.query(`SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid WHERE movies.movieid = ${req.body.id} ORDER BY movies.movie_name`, function(err, result, fields) {
    if (err) throw err;
    console.log(result[0].movie_name)

    connection.query(`SELECT people.person_name, people.birth_date, people.path_to_img, roles.person_role,  roles.role_as FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.movieid = ${result[0].movieid}`, function (err, result2, fields) {
      if (err) throw err;
      console.dir(result2);
      connection.query(`SELECT comments.username, comments.rating, comments.title, comments.content FROM comments INNER JOIN movies ON comments.movieid = movies.movieid WHERE movies.movieid = ${req.body.id}`, function(err, result3, fields) {
        if (err) throw err;
        res.render('pages/details', {
          movie: result[0],
          cast: result2,
          comments: result3,
          date: date,
          localStorage: localStorage
        })
      })
    })

  })
})

app.post('/addcomment', function(req, res) {
  connection.query(`INSERT INTO comments (movieid, username, rating, title, content) VALUES (${req.body.movieid}, "${localStorage.getItem('username')}", ${req.body.rating}, "${req.body.title}", "${req.body.comment}")`, function(err, result, fields) {
    if (err) throw err;
    alert = "Sikeres véleményhozzáadás";
    res.redirect("/");
  })
})

app.post('/favourite', function(req, res) {
  if (localStorage.getItem('loggedin') == 'false') {
    res.redirect('/');
  } else {
    let username = localStorage.getItem('username')
    connection.query(`SELECT movieid FROM favourites WHERE username = "${username}"`, function(err, result, fields) {
      let favouriteFound = false;
      if (result[0]) {
        console.dir(result)
        result.forEach(element => {
          if (element.movieid == req.body.movieid) {
            favouriteFound = true;
          }
        });
        if (favouriteFound) {
          console.log("Already favourited")
          console.log(req.body.movieid)
          console.log(localStorage.getItem('username'))
          connection.query(`DELETE FROM favourites WHERE username = "${username}" AND movieid = "${req.body.movieid}"`, function(err, result) {
            res.redirect('/');
          });
        } else {
          console.log("Not yet favourited")
          connection.query(`INSERT INTO favourites (username, movieid) VALUES ("${username}", "${req.body.movieid}")`, function() {
            res.redirect('/');
          });
        }
      } else {
        connection.query(`INSERT INTO favourites (username, movieid) VALUES ("${username}", "${req.body.movieid}")`);
        console.log("Not yet favourite");
        res.redirect('/');
      }
    })
  }
})


app.post('/login', function(req, res) {
  if (localStorage.getItem('loggedin') == "false") {
    let passwd = crypto.createHash('sha256').update(req.body.passwd).digest('hex');
    connection.query(`SELECT passwd FROM accounts WHERE username = '${req.body.username}'`, function(err, result , fields) {
      if (err) throw err;
      if (result[0].passwd == passwd) {
        localStorage.setItem('loggedin', true);
        localStorage.setItem('username', req.body.username);
        console.log('Sikeres bejelentkezés!')
      } else {
        console.log('Hibás adatok!');
      }
      res.redirect('/');
    })
  } else {
    console.log('Be vagy jelentkezve, skipping');
    res.redirect('/');
  }
});

app.post('/logout', function (req, res) {
  console.log('Kijelentkezés')
  localStorage.setItem('username', null);
  localStorage.setItem('loggedin', false);
  res.redirect('/');
})

app.post('/register', function(req, res) {
  console.log("entered username: " + req.body.username);
  if (req.body.passwd != req.body.passwd_again) {
    console.log("A két jelszó nem egyezik!");
    res.redirect('/');
    return;
  }
  connection.query(`SELECT username FROM accounts WHERE email = "${req.body.email}" OR username = "${req.body.username}";`, function(err, result, fields) {
    console.log("Regisztráció kezdése")
    if (err) throw err;
    if (result[0]) {
      console.dir(result);
      console.log("Ez a felhasználónév vagy e-mail már foglalt!")
    } else {
      console.log('Sikeres regisztráció!');
      let passwd_encrypted = crypto.createHash('sha256').update(req.body.passwd).digest('hex');
      connection.query(`INSERT INTO accounts (username, email, passwd) VALUES ('${req.body.username}', '${req.body.email}', '${passwd_encrypted}')`)
      localStorage.setItem('username', req.body.username);
      localStorage.setItem('loggedin', true);
    }
    res.redirect('/');
  })
})

app.use( express.static( "public" ) );

app.listen(8080);


console.log('Server is listening on port 8080');