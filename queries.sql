--Főoldal
    SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
    FROM movies INNER JOIN ratings ON ratings.movieid = movies.movieid;
    ORDER BY movies.movie_name
    --Kedvencek lekérdezése
    SELECT movieid
    FROM favourites
    WHERE username = "${localStorage.getItem('username')}";

--Film hozzáadása
    --Összes ember lekérdezése a kilistázáshoz
    SELECT *
    FROM people
    ORDER BY person_name;

    --Film hozzáadása adatbázishoz
    INSERT INTO movies (movie_name, release_date, movie_studio${req.body.details != "" ? ", movie_desc" : ""}, path_to_img)
    VALUES ("${req.body.movie_name}", ${req.body.release_date}, 
    "${req.body.movie_studio}"${req.body.details != "" ? ', "' + req.body.movie_details + '"': ""}
    ${req.files != undefined ? ", " + '"/img/cover/' + req.files.file.name + '"' :", " + '"/img/cover/default.jpg"'});

    --Rendező összekötése a filmmel
    INSERT INTO roles (personid, movieid, person_role)
    VALUES (${req.body.director},
    (SELECT movieid FROM movies WHERE movie_name = "${req.body.movie_name}" ORDER BY movieid DESC LIMIT 1), 'director');

--People oldal
    --Emberek kilistázása
    SELECT personid, person_name, path_to_img
    FROM people;

    --Ember hozzáadása adatbázishoz
    INSERT INTO people (person_name${req.body.birth_date != "" ? ", birth_date" : ""}${req.files != undefined ? ", path_to_img" : ""})
    VALUES ("${req.body.person_name}"${req.body.birth_date != "" ? ", " + '"' + req.body.birth_date + '"' : ""}
    ${req.files != undefined ? ", " + '"/img/people/' + req.files.file.name + '"' : ""});

    --Ember törlése
    DELETE FROM people
    WHERE personid = ${req.body.personid};

--Keresés oldal
    --Keresési találatok lekérdezése
    SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
    FROM movies INNER JOIN ratings ON ratings.movieid = movies.movieid
    WHERE movies.movie_name LIKE "%${req.body.input}%" ORDER BY movies.movie_name;

    --Kedvencek lekérdezése
    SELECT movieid FROM favourites WHERE username = "${localStorage.getItem('username')}";

--Részletek oldal
    --Film részletek lekérdezése
    SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
    FROM movies INNER JOIN ratings ON ratings.movieid = movies.movieid
    WHERE movies.movieid = ${req.body.id}
    ORDER BY movies.movie_name;

    --Rendező + szereplők lekérdezése a filmhez
    SELECT people.person_name, people.birth_date, people.path_to_img, roles.person_role, roles.role_as
    FROM people INNER JOIN roles ON people.personid = roles.personid
    WHERE roles.movieid = ${result[0].movieid};

    --Hozzászólások lekérdezése a filmhez
    SELECT comments.username, comments.rating, comments.title, comments.content
    FROM comments INNER JOIN movies ON comments.movieid = movies.movieid
    WHERE movies.movieid = ${req.body.id};

    --Vélemény hozzáadása a filmhez
    INSERT INTO comments (movieid, username, rating, title, content) VALUES
    (${req.body.movieid}, "${localStorage.getItem('username')}", ${req.body.rating}, "${req.body.title}", "${req.body.comment}");

--Kedvencek kezelése
    --Felhasználó kedvenceinek listázása
    SELECT movieid
    FROM favourites
    WHERE username = "${username}";

    --Film kedvencekhez hozzáadása
    INSERT INTO favourites (username, movieid)
    VALUES ("${username}", "${req.body.movieid}");

    --Film törlése a kedvencek közül
    DELETE FROM favourites
    WHERE username = "${username}" AND movieid = "${req.body.movieid}";