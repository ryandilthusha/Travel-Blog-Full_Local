-- users Table (For Login and Registration)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_picture TEXT
);

INSERT INTO users (username, password, bio, profile_picture) 
VALUES ('RyanWick1', '123', 'Hey there, I''m from Sri Lanka.', 'default-profile.jpg');

SELECT * FROM users;



-- travel_stats Table (For Profile)
CREATE TABLE travel_stats (
    user_id INT PRIMARY KEY,
    countries_visited INT,
    cities_explored INT,
    favorite_destination VARCHAR(255),
    bucket_list TEXT, -- Assuming this might be a longer list, TEXT is chosen
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO travel_stats (user_id, countries_visited, cities_explored, favorite_destination, bucket_list)
VALUES (1, 10, 25, 'Japan', 'Visit the Pyramids of Egypt, Explore the Amazon Rainforest');


SELECT * FROM travel_stats;












-- Users
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    ProfilePicture TEXT,
    Role VARCHAR(50) NOT NULL CHECK (Role IN ('Admin', 'Viewer', 'Critic'))
);

-- Categories (Genres)
CREATE TABLE Categories (
    GenreID SERIAL PRIMARY KEY,
    GenreName VARCHAR(255) NOT NULL,
    Description TEXT
);

-- Films
CREATE TABLE Films (
    FilmID SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Director VARCHAR(255),
    ReleaseDate DATE,
    GenreID INT,
    Synopsis TEXT,
    CoverImage TEXT,
    FOREIGN KEY (GenreID) REFERENCES Categories(GenreID)
);

-- Reviews
CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    FilmID INT NOT NULL,
    ReviewText TEXT NOT NULL,
    Rating DECIMAL CHECK (Rating >= 0 AND Rating <= 5), -- Assuming a 1-5 rating scale
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (FilmID) REFERENCES Films(FilmID)
);

-- Comments
CREATE TABLE Comments (
    CommentID SERIAL PRIMARY KEY,
    ReviewID INT NOT NULL,
    UserID INT NOT NULL,
    CommentText TEXT NOT NULL,
    CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Tags
CREATE TABLE Tags (
    TagID SERIAL PRIMARY KEY,
    TagName VARCHAR(255) NOT NULL,
    Description TEXT
);

-- Film_Tags (Junction table for Films to Tags Many-to-Many relationship)
CREATE TABLE Film_Tags (
    FilmID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (FilmID, TagID),
    FOREIGN KEY (FilmID) REFERENCES Films(FilmID),
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
);

-- Review_Tags (Junction table for Reviews to Tags Many-to-Many relationship)
CREATE TABLE Review_Tags (
    ReviewID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (ReviewID, TagID),
    FOREIGN KEY (ReviewID) REFERENCES Reviews(ReviewID),
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
);


