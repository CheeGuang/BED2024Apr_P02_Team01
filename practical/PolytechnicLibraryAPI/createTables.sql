-- Drop tables in the correct order to prevent foreign key reference errors
IF OBJECT_ID('UserBooks', 'U') IS NOT NULL
    DROP TABLE UserBooks;
IF OBJECT_ID('Books', 'U') IS NOT NULL
    DROP TABLE Books;
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
GO

-- Create Users table
CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  username VARCHAR(50) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('member', 'librarian')) NOT NULL
);
GO

-- Create Books table
CREATE TABLE Books (
  id INT PRIMARY KEY IDENTITY(1,1),
  title VARCHAR(50) NOT NULL UNIQUE,
  author VARCHAR(50) NOT NULL,
  availability CHAR(1) CHECK (availability IN ('Y', 'N')) NOT NULL
);
GO

-- Create UserBooks table
CREATE TABLE UserBooks (
  id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(id),
  book_id INT FOREIGN KEY REFERENCES Books(id)
);
GO

-- Insert sample books
INSERT INTO Books (title, author, availability)
VALUES
  ('The Lord of the Rings', 'J.R.R. Tolkien', 'Y'),
  ('Pride and Prejudice', 'Jane Austen', 'Y'),
  ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Y'),
  ('Dune', 'Frank Herbert', 'Y'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Y');
GO

-- Insert sample users
INSERT INTO Users (username, passwordHash, role)
VALUES
  ('user1', 'passwordHash1', 'member'),
  ('user2', 'passwordHash2', 'member'),
  ('user3', 'passwordHash3', 'librarian');
GO

-- Insert relationships between users and books
INSERT INTO UserBooks (user_id, book_id)
VALUES
  (1, 1),  -- User 1 has book 1
  (1, 2),  -- User 1 has book 2
  (1, 4),  -- User 1 has book 4
  (2, 3),  -- User 2 has book 3
  (2, 5),  -- User 2 has book 5
  (3, 1),  -- User 3 has book 1
  (3, 6);  -- User 3 has book 6
GO

-- Select data from tables
SELECT * FROM Books;
SELECT * FROM Users;
SELECT * FROM UserBooks;
GO
