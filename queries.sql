--Main Page Query
SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid
ORDER BY movies.movie_name

--Movie Details Query
SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid
WHERE movies.movieid = ${req.body.id}
ORDER BY movies.movie_name

--People Details Query
SELECT people.person_name, people.birth_date, people.path_to_img, roles.person_role,  roles.role_as
FROM people INNER JOIN roles ON people.personid = roles.personid
WHERE roles.movieid = ${movieid}

--Search Query
SELECT movies.*, ratings.user_rating, ratings.rotten_tomatoes
FROM movies LEFT JOIN ratings ON ratings.movieid = movies.movieid
WHERE movies.movie_name LIKE "%${req.body.input}%"
ORDER BY movies.movie_name