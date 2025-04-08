// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
                  user_id INTEGER PRIMARY KEY,
                  first_name VARCHAR(255) NOT NULL,
                  last_name VARCHAR(255) NOT NULL,
                  age INTEGER,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  photo_path VARCHAR(255),
                  program_id INTEGER,
                  hobbies TEXT,
                  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (program_id) REFERENCES Programs(program_id)
              )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Programs (
                    program_id INTEGER PRIMARY KEY,
                    program_name VARCHAR(255) NOT NULL,
                    description TEXT
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS Courses (
                    course_id INTEGER PRIMARY KEY,
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
            db.run(`
                INSERT OR IGNORE INTO Programs (program_id, program_name, description) VALUES 
                (1, 'Informatica', 'Programmeren, datastructuren en algoritmen.'),
                (2, 'Bedrijfskunde', 'Management, financiën en ondernemerschap.'),
                (3, 'Werktuigbouwkunde', 'Natuurkunde, materialen en robotica.')`
            );
            db.run(`
                INSERT OR IGNORE INTO Courses (course_name, description, duration, points) VALUES 
                ('Algoritmen', 'Introductie tot algoritmen en datastructuren.', '10 weken', 6),
                ('Databasesystemen', 'SQL, normalisatie en indexering.', '8 weken', 5),
                ('Webontwikkeling', 'HTML, CSS, JavaScript en backend.', '12 weken', 7),
                ('Machine Learning', 'Geleide en ongecontroleerde leertechnieken.', '14 weken', 6),
                ('Marketing 101', 'Basisprincipes van marketing en consumentengedrag.', '6 weken', 4),
                ('Natuurkunde voor Ingenieurs', 'Fundamenten van natuurkunde voor techniek.', '10 weken', 5),
                ('Software Engineering', 'Ontwikkelmethodologieën en best practices.', '10 weken', 6),
                ('Financiële Basisprincipes', 'Introductie tot financiële concepten.', '8 weken', 4),
                ('Besturingssystemen', 'Processen, geheugenbeheer en beveiliging.', '12 weken', 7),
                ('Ondernemerschap', 'Hoe start en beheer je een bedrijf.', '10 weken', 5)`
            );
            
            const fixedUsers = [
                [1, 'Daan', 'De Vries', 22, 'daan1@email.com', 'Pass123!', 1],
                [2, 'Sanne', 'Jansen', 24, 'sanne2@email.com', 'Pass123!', 2],
                [3, 'Bram', 'Van den Berg', 21, 'bram3@email.com', 'Pass123!', 1],
                [4, 'Fleur', 'Bakker', 23, 'fleur4@email.com', 'Pass123!', 3],
                [5, 'Lars', 'Peters', 20, 'lars5@email.com', 'Pass123!', 1]
            ];

            const hobbies = JSON.stringify(['Lezen', 'Sport', 'Coderen']);

            const insertUsers = fixedUsers.map(user => {
                return new Promise((resolve, reject) => {
                    bcrypt.hash(user[5], saltRounds, (err, hashedPassword) => {
                        if (err) return reject(err);
            
                        db.run(`INSERT OR IGNORE INTO Users 
                                (user_id, first_name, last_name, age, email, password, program_id, hobbies) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                            [user[0], user[1], user[2], user[3], user[4], hashedPassword, user[6], hobbies],
                            (err) => {
                                if (err) return reject(err);
                                resolve();
                            }
                        );
                    });
                });
            });

            const userCourses = [
                [1, 1],
                [1, 2],
                [2, 3],
                [2, 4],
                [3, 1],
                [3, 3],
                [4, 5],
                [5, 6]
            ];

            const friendships = [
                [1, 2],
                [1, 3],
                [2, 4],
                [3, 5]
            ];

            const messages = [
                [1, 2, "Hey, hoe gaat het?"],
                [2, 1, "Prima! En met jou?"],
                [3, 1, "Wil je samen studeren?"],
                [4, 2, "Heb je de opdracht al af?"],
                [5, 3, "Ik heb moeite met databases, kun je helpen?"]
            ];
            
            Promise.all(insertUsers)
                .then(() => {
                    // Voeg daarna pas userCourses, friendships en messages toe
                    userCourses.forEach(([userId, courseId]) => {
                        db.run(`INSERT OR IGNORE INTO User_Courses (user_id, course_id, date_enrolled) VALUES (?, ?, DATE('now'))`, [userId, courseId]);
                    });
            
                    friendships.forEach(([user1, user2]) => {
                        db.run(`INSERT OR IGNORE INTO Friendships (user_id, friend_id, status) VALUES (?, ?, 1)`, [user1, user2]);
                    });
            
                    messages.forEach(([sender, receiver, text]) => {
                        db.run(`INSERT OR IGNORE INTO Messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`, [sender, receiver, text]);
                    });
            
                    console.log("Database succesvol gevuld met vaste testdata!");
                })
                .catch(err => {
                    console.error("Error inserting users:", err);
                });

            console.log("Database succesvol gevuld met vaste testdata!");
        }); // End serialize
    }
});


module.exports = db;