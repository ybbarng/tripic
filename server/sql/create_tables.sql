CREATE TABLE IF NOT EXISTS Trips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    UNIQUE KEY (name)
);

CREATE TABLE IF NOT EXISTS Pics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    datetime DATETIME NOT NULL,
    location POINT NOT NULL,
    image_url VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES Trips (id),
    SPATIAL INDEX (location)
);

CREATE TABLE IF NOT EXISTS Tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    UNIQUE KEY (name)
);

CREATE TABLE IF NOT EXISTS PicsTags (
    pic_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (pic_id) REFERENCES Pics (id),
    FOREIGN KEY (tag_id) REFERENCES Tags (id),
    PRIMARY KEY (pic_id, tag_id)
);
