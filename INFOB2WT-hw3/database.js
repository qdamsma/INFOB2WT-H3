// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'my_website.db'); // Explicit path
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database opening error:", err);
    } else {
        console.log('Connected to the SQLite database at:', dbPath);
        //Enable foreign keys
        db.run("PRAGMA foreign_keys = ON;", (err) => {
            if (err) {
                console.error("Error enabling foreign keys:", err);
            }
        });

        // Create tables if they don't exist
        db.serialize(() => { // Serialize to ensure tables are created in order
            db.run(`
              CREATE TABLE IF NOT EXISTS Users (
                  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  first_name VARCHAR(255) NOT NULL,
                  last_name VARCHAR(255) NOT NULL,
                  age INTEGER,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,  -- Store hashed password
                  photo_path VARCHAR(255),
                  program_id INTEGER,
                  hobbies TEXT,
                  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (program_id) REFERENCES Programs(program_id)
              )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Programs (
                    program_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    program_name VARCHAR(255) NOT NULL,
                    description TEXT
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Courses (
                    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    course_name VARCHAR(255) NOT NULL,
                    description TEXT,
                    duration VARCHAR(255),
                    points INTEGER
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS User_Courses (
                    user_id INTEGER,
                    course_id INTEGER,
                    date_enrolled DATE,
                    grade VARCHAR(255),
                    PRIMARY KEY (user_id, course_id),
                    FOREIGN KEY (user_id) REFERENCES Users(user_id),
                    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Friendships (
                    user_id INTEGER,
                    friend_id INTEGER,
                    status INTEGER NOT NULL,  -- 0: pending, 1: accepted, 2: rejected
                    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, friend_id),
                    FOREIGN KEY (user_id) REFERENCES Users(user_id),
                    FOREIGN KEY (friend_id) REFERENCES Users(user_id)
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Messages (
                    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender_id INTEGER NOT NULL,
                    receiver_id INTEGER NOT NULL,
                    message_text TEXT,
                    sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_read INTEGER DEFAULT 0,  -- 0: false, 1: true
                    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
                    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
                )
            `);
        }); // End serialize

    }
});

module.exports = db;