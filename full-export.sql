CREATE DATABASE IF NOT EXISTS imdb;
USE imdb;

CREATE TABLE IF NOT EXISTS accounts (
    email     varchar(50) NOT NULL,
    username  varchar(50) NOT NULL,
    passwd    varchar(500) NOT NULL,
    full_name varchar(50),
    PRIMARY KEY (username, email)
) ENGINE=InnoDB;

INSERT INTO `accounts` (email, username , passwd, full_name) VALUES
	('email@g.com', 'Bél@', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', NULL),
	('isfekete12@gmail.com', 'Horusz_', 'c38777d1619a83b0ee9e6e23868bb47b29f81875090a0b5d4e607263df35fec1', NULL),
	('asd', 'kecske', '688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6', NULL),
	('prager.gero@', 'kecske12345', '688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6', NULL),
	('asdasdasd', 'kecske2', '688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6', NULL),
	('kurunczinandi@gmail.com', 'Nandee', '5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8', NULL);

CREATE TABLE IF NOT EXISTS movies (
    movieid int NOT NULL AUTO_INCREMENT,
    movie_name varchar(50) NOT NULL,
    release_date year NOT NULL,
    movie_studio varchar(50),
    movie_desc varchar(1000),
    path_to_img varchar(50),
    PRIMARY KEY (movieid)
) ENGINE=InnoDB;

INSERT INTO `movies` (`movieid`, `movie_name`, `release_date`, `movie_studio`, `movie_desc`, `path_to_img`) VALUES
	(2, 'Shrek', '2001', 'DreamWorks Studios', 'Hol volt, hol nem volt, egy messzi mocsárban, meghitt magányban élt egyszer egy morcos ogre, akit Shreknek hívtak. Ám a zöld szörny nyugalmát és életét egy napon fenekestül felbolygatta egy különös esemény: mesebeli lények lepték el a mocsarat - és lepték meg gyanútlan hősünket. A három vak egér futkározott a vacsoráján, a nagy, gonosz farkas feküdt az ágyában, a hét törpe Hófehérke koporsóját tette az asztalára, kunyhója előtt pedig ott nyüzsgött a három hajléktalan kismalac, és mindenféle más varázslatos figurák, akiket a gonosz Farquaad nagyúr űzött el otthonukból. Shrek tehát elment a nagyúrhoz, hogy visszakövetelje mocsarát, de ehhez előbb meg kell mentenie a szörnyű tűzokádó sárkány karmaiból Fiona királylányt, hogy Farquaad feleségül vehesse, és így király lehessen... A nagy kalandban társa is akad az ogrének: a szószátyár Szamár, aki bármit megtenne Shrekért. Hamarosan kiderül, hogy a sárkánynál sokkal nagyobb problémát jelent Fiona különös titka...', '/img/cover/shrek.png'),
	(3, 'Verdák', '2006', 'Pixar Studios', 'Villám McQueen hírnévről és dicsőségről álmodik, minden vágya, hogy elhódítsa a Szelep Kupát. Egy napon a versenyverda szedi a dísztárcsáit és felkerekedik. Padlógázzal tart Kaliforniába, ahol hírnévre tehet szert, ha sikerül legyőznie a két legnagyobb ászt a mezőnyben. Útközben vetődik az álmos kisvárosba, Kipufogó-fürdőbe, ahol ráébred arra, mi az, ami valóban fontos az életben. Kalandjai során találkozik Hudson Dokival, a vidéki orvos és bíró valójában háromszoros Szelep Kupa győztes. Ott van azután Sally, a dögös Porsche 911, és a rozoga autómentő, akinek rozsdás karosszériája alatt érző motor dobog.', '/img/cover/verdak.jpg'),
	(4, 'Persona 4: The Animation', '2011', 'Anime International Company', 'Angol: On April 11th 2011, a rash of mysterious murders strikes the rural town of Inaba soon after high school student Yu Narukami moves from the city to live with his uncle. The bodies are being hung from power lines, and the police have no suspects. The images of the missing victims are shown on the TV at midnight, aptly named Midnight Channel before their bodies are discovered. Yu soon discovers an unusual world on the other side of a TV that is linked to these deaths. On the other side people are facing shadowy monsters and the darker sides of their souls. It is up to Yu and his new friends to investigate and try and stop the killer from claiming any more lives.', '/img/cover/persona4.jpg'),
	(6, 'A Karib-tenger kalózai: A Fekete Gyöngy átka', '2003', 'Wlat Disney Pictures', 'A XVII. században a Karib-tenger a kalózok birodalma volt, akik megfélemlítették az angol királyi flottát is. Elizabeth Swannt, az angol kormányzó lányát elrabolja a rettegett kalóz, Barbossa kapitány. A lány gyerekkori barátja és szerelme, Will Turner a lány megmentésére indul, és akarva-akaratlanul a kalózok segítségét kell kérnie. Jack Sparrow, a kalózok vezére felfedi Barbossa és társai titkát. Will és Jack megkísérlik a lehetetlent: megszerezni a Fekete Gyöngyöt, kimenteni a lányt és mellesleg megszerezni a világ legdrágább kincsét.', '/img/cover/karib_tenger_kalozai1.jpg');

CREATE TABLE IF NOT EXISTS people (
    personid int NOT NULL AUTO_INCREMENT,
    person_name varchar(50) NOT NULL,
    birth_date date,
    path_to_img varchar(50),
    PRIMARY KEY (personid)
) ENGINE = InnoDB;

INSERT INTO `people` (personid, person_name, birth_date, path_to_img) VALUES
	(1, 'John Lasseter', '1957-01-12', NULL),
	(2, 'Owen Wilson', '1968-11-18', '/img/people/owen_wilson.jpg'),
	(3, 'Bonnie Hunt', '1961-09-22', NULL),
	(4, 'Larry the Cable Guy', '1963-02-17', NULL),
	(5, 'Paul Newman', '1925-01-26', NULL),
	(6, 'William Steig', '1907-11-14', NULL),
	(7, 'Ceech Marin', '1946-09-13', NULL),
	(8, 'Tony Shalhoub', '1953-10-09', NULL),
	(10, 'Guido Quaroni', NULL, NULL),
	(11, 'Jenifer Lewis', '1957-01-25', NULL),
	(12, 'Paul Dooley', '1928-02-22', NULL),
	(13, 'Michael Wallis', '1945-10-07', NULL),
	(14, 'Johnny Depp', NULL, NULL),
	(15, 'Orlando Bloom', NULL, NULL),
	(16, 'Keira Knightley', NULL, NULL),
	(17, 'Geoffrey Rush', NULL, NULL),
	(18, 'Jack Davenport', NULL, NULL),
	(19, 'Jonathan Pryce', NULL, NULL),
	(20, 'Lee Arenberg', NULL, NULL),
	(21, 'Mackenzie Crook', NULL, NULL),
	(22, 'Gore Verbinski', NULL, NULL),
	(30, 'Szenyor Matuka', NULL, '/img/people/cimbilimbi.png');

CREATE TABLE IF NOT EXISTS ratings (
    movieid int NOT NULL,
    user_rating int,
    rotten_tomatoes int,
    CONSTRAINT movieid FOREIGN KEY (movieid) REFERENCES movies(movieid) ON DELETE CASCADE
) ENGINE = InnoDB;

INSERT INTO `ratings` (`movieid`, `user_rating`, `rotten_tomatoes`) VALUES
	(2, 9, 88),
	(3, 8, 74),
	(4, 9, 0),
	(6, 9, 80);

CREATE TABLE IF NOT EXISTS roles (
    personid int NOT NULL,
    movieid int NOT NULL,
    person_role varchar(50) NOT NULL,
    role_as varchar(50),
    CONSTRAINT personid FOREIGN KEY (personid) REFERENCES people(personid) ON DELETE CASCADE,
    FOREIGN KEY (movieid) REFERENCES movies(movieid) ON DELETE CASCADE
);

INSERT INTO `roles` (`personid`, `movieid`, `person_role`, `role_as`) VALUES
	(1, 3, 'director', NULL),
	(2, 3, 'cast', 'Villám McQueen'),
	(3, 3, 'cast', 'Sally'),
	(4, 3, 'cast', 'Matuka'),
	(5, 3, 'cast', 'Hudson Doki'),
	(6, 2, 'cast', 'Shrek'),
	(7, 3, 'cast', 'Ramone'),
	(8, 3, 'cast', 'Luigi'),
	(10, 3, 'cast', 'Guido'),
	(12, 3, 'cast', 'Őrmester'),
	(13, 3, 'cast', 'Seriff'),
	(11, 3, 'cast', 'Tőti'),
	(14, 6, 'cast', 'Jack Sparrow'),
	(15, 6, 'cast', 'Will Turner'),
	(16, 6, 'cast', 'Elizabeth Swann'),
	(22, 6, 'director', NULL),
	(17, 6, 'cast', 'Hector Barbossa'),
	(18, 6, 'cast', 'James Norrington'),
	(19, 6, 'cast', 'Weatherby Swann kormányzó'),
	(20, 6, 'cast', 'Pintel'),
	(21, 6, 'cast', 'Ragetti');

CREATE TABLE IF NOT EXISTS comments (
    movieid  int         NOT NULL,
    username varchar(50) NOT NULL,
    rating   int         NOT NULL,
    title    varchar(50),
    content  varchar(500),
    FOREIGN KEY (movieid) REFERENCES movies(movieid) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE
);

INSERT INTO `comments` (`movieid`, `username`, `rating`, `title`, `content`) VALUES
	(3, 'kecske', 9, 'Nagyon jó', 'Kedvenc filmem');

CREATE TABLE IF NOT EXISTS favourites (
    username varchar(50) NOT NULL,
    movieid int NOT NULL,
    FOREIGN KEY (movieid) REFERENCES movies(movieid) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE CASCADE
)