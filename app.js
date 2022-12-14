var express = require('express');
var app = express();
var mysql = require('mysql');
const date = require('date-and-time');
const crypto = require('crypto');
const upload = require('express-fileupload');
const { Http2ServerRequest } = require('http2');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// enable files upload
app.use(upload());

var connection = mysql.createConnection(
  {
    host: '192.168.1.163',
    user: 'imdb_user',
    password: 'root',
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
    if (localStorage.getItem('loggedin') == "true") {
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
    } else {
      res.render('pages/index', {
        res: result,
        localStorage: localStorage,
        res2: undefined,
        alert: alert
      });
      alert = "";
    }
    
  })
});

app.get('/addmovie', function(req, res) {
  connection.query('SELECT * FROM people ORDER BY person_name', function(err, result, fields) {
    res.render('pages/addmovie.ejs', {
      people: result
    });
  })
})

app.post('/createmovie', function(req, res) {
  console.log(req.body.movie_name + ", " + req.body.movie_studio + ", " + req.body.release_date + ", " + req.body.director + ", " + req.body.details);
  connection.query(`INSERT INTO movies (movie_name, release_date, movie_studio, movie_desc, path_to_img) VALUES ("${req.body.movie_name}", ${req.body.release_date}, "${req.body.movie_studio}"${req.body.details != undefined ? ', "' + req.body.details + '"': ""}${req.files != null ? ", " + '"/img/cover/' + req.files.file.name + '"' :", " + '"/img/cover/default.jpg"'})`, function(err, result, fields) {
    if (err) throw err;
    if (req.files) {
      req.files.file.mv("./public/img/cover/" + req.files.file.name, function(err) {
        if (err) throw err;
      });
    }
    connection.query(`INSERT INTO roles (personid, movieid, person_role) VALUES (${req.body.director}, (SELECT movieid FROM movies WHERE movie_name = "${req.body.movie_name}" ORDER BY movieid DESC LIMIT 1), 'director')`, function(err2, result2, fields) {
      if (err2) throw err2;
      res.redirect('/');
      alert = req.body.movie_name + " sikeresen hozz??adva az adatb??zishoz!";
    })
  })
})

app.post('/deletemovie', function(req, res) {
  console.log(req.body.movieid);
  connection.query(`DELETE FROM movies WHERE movieid = ${req.body.movieid}`, function(err, result, fields) {
    if (err) throw err;
    alert = "Film sikeresen t??r??lve!";
    res.redirect('/');
  })
})

app.get('/people', function(req, res) {
  connection.query(`SELECT personid, person_name, path_to_img FROM people ORDER BY person_name`, function(err, result, fields) {
    if (err) throw err;
    connection.query('SELECT Count(people.personid) AS count FROM people INNER JOIN roles ON people.personid = roles.personid', function(err2, result2, fields) {
      if (err2) throw err2;
      console.log(result2)
      res.render('pages/people', {
        count: result2[0].count,
        people: result,
        localStorage: localStorage
      })
    })
  })
})

app.get('/people_cast', function(req, res) {
  connection.query('SELECT people.personid, people.person_name, people.path_to_img FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.person_role = "cast" GROUP BY people.personid ORDER BY people.person_name', function(err, result, fields) {
    connection.query('SELECT Count(people.personid) AS count FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.person_role = "cast"', function(err2, result2, fields) {
      res.render('pages/people', {
        count: result2[0].count,
        people: result,
        localStorage: localStorage
      })
    })
  })
})

app.get('/people_directors', function(req, res) {
  connection.query('SELECT people.personid, people.person_name, people.path_to_img FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.person_role = "director" GROUP BY people.personid ORDER BY people.person_name', function(err, result, fields) {
    connection.query("SELECT Count(distinct people.personid) AS count FROM people INNER JOIN roles ON people.personid = roles.personid WHERE roles.person_role = 'director'", function(err2, result2, fields) {
      console.log(result2[0].count)
      res.render('pages/people', {
        count: result2[0].count,
        people: result,
        localStorage: localStorage
      })
    })
  })
})

app.get('/addperson', function(req, res) {
  res.render('pages/addperson.ejs');
})

app.post('/createperson', function(req, res) {
  console.log(req.files);
  console.log(req.body.birth_date);
  connection.query(`INSERT INTO people (person_name${req.body.birth_date != "" ? ", birth_date" : ""}${req.files != undefined ? ", path_to_img" : ""}) VALUES ("${req.body.person_name}"${req.body.birth_date != "" ? ", " + '"' + req.body.birth_date + '"' : ""}${req.files != undefined ? ", " + '"/img/people/' + req.files.file.name + '"' : ""})`, function(err, result, fields) {
    if (err) throw err;
    if (req.files) {
      req.files.file.mv("./public/img/people/" + req.files.file.name, function(err) {
        if (err) throw err;
      });
    }
  })
  res.redirect('/people');
})

app.post('/deleteperson', function(req, res) {
  connection.query(`DELETE FROM people WHERE personid = ${req.body.personid}`, function(err, result, fields) {
    if (err) throw err;
    console.log("Person deleted");
    res.redirect('/people');
  })
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
        connection.query('SELECT personid, person_name FROM people ORDER BY person_name', function(err, result4, fields) {
          res.render('pages/details', {
            movie: result[0],
            cast: result2,
            comments: result3,
            people: result4,
            date: date,
            localStorage: localStorage
          })
        })

      })
    })

  })
})

app.post('/editmovie', function(req, res) {
  connection.query('SELECT personid, person_name FROM people ORDER BY person_name', function(err, result, fields) {
    res.render('pages/editmovie.ejs', {
      people: result,
      movieid: req.body.movieid
    });
  })
})

app.post('/editmoviedata', function(req, res) {
  console.log(req.body.movieid)
  connection.query(`UPDATE movies SET movie_name = "${req.body.movie_name}, release_date = ${req.body.release_date}, movie_studio = "${req.body.movie_studio}", movie_desc = "${req.body.movie_desc}" WHERE movieid = ${req.body.movieid}`, function(err, result, fields) {
    alert = "Film sikeresen szerkesztve!";
    res.redirect('/');
  })
})

app.post('/addpersontomovie', function(req, res) {
  connection.query(`INSERT INTO roles (personid, movieid, person_role, role_as) VALUES (${req.body.person}, ${req.body.movieid}, "cast", "${req.body.role_as}")`)
  alert = "Sikeres hozz??ad??s!";
  res.redirect('/');
})

app.post('/addcomment', function(req, res) {
  connection.query(`INSERT INTO comments (movieid, username, rating, title, content) VALUES (${req.body.movieid}, "${localStorage.getItem('username')}", ${req.body.rating}, "${req.body.title}", "${req.body.comment}")`, function(err, result, fields) {
    if (err) throw err;
    alert = "Sikeres v??lem??nyhozz??ad??s";
    res.redirect("/");
  })
})

app.post('/favourite', function(req, res) {
  if (localStorage.getItem('loggedin') == 'false') {
    res.redirect('/');
  } else {
    let username = localStorage.getItem('username')
    connection.query(`SELECT movieid FROM favourites WHERE username = "${username}"`, function(err, result, fields) {
      if (err) throw err;
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
  if (localStorage.getItem('loggedin') == "false" || localStorage.getItem('loggedin') == null) {
    let passwd = crypto.createHash('sha256').update(req.body.passwd).digest('hex');
    connection.query(`SELECT passwd FROM accounts WHERE username = '${req.body.username}'`, function(err, result , fields) {
      if (err) throw err;
      if (result[0].passwd == passwd) {
        localStorage.setItem('loggedin', true);
        localStorage.setItem('username', req.body.username);
        console.log('Sikeres bejelentkez??s!')
      } else {
        console.log('Hib??s adatok!');
      }
      res.redirect('/');
    })
  } else {
    console.log('Be vagy jelentkezve, skipping');
    res.redirect('/');
  }
});

app.post('/logout', function (req, res) {
  console.log('Kijelentkez??s')
  localStorage.setItem('username', null);
  localStorage.setItem('loggedin', false);
  res.redirect('/');
})

app.post('/register', function(req, res) {
  console.log("entered username: " + req.body.username);
  if (req.body.passwd != req.body.passwd_again) {
    console.log("A k??t jelsz?? nem egyezik!");
    res.redirect('/');
    return;
  }
  connection.query(`SELECT username FROM accounts WHERE email = "${req.body.email}" OR username = "${req.body.username}";`, function(err, result, fields) {
    console.log("Regisztr??ci?? kezd??se")
    if (err) throw err;
    if (result[0]) {
      console.dir(result);
      console.log("Ez a felhaszn??l??n??v vagy e-mail m??r foglalt!")
    } else {
      console.log('Sikeres regisztr??ci??!');
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