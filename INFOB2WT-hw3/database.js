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
                [1, 'Daan', 'De Vries', 22, 'daan1@email.com', 'Pass123!', 1, ['Lezen', 'Sport', 'Coderen']],
                [2, 'Sanne', 'Jansen', 24, 'sanne2@email.com', 'Pass123!', 2, ['Reizen', 'Muziek', 'Film']],
                [3, 'Bram', 'Van den Berg', 21, 'bram3@email.com', 'Pass123!', 1, ['Koken', 'Fotografie', 'Tuinieren']],
                [4, 'Fleur', 'Bakker', 23, 'fleur4@email.com', 'Pass123!', 3, ['Schaken', 'Wandelen', 'Kunst']],
                [5, 'Lars', 'Peters', 20, 'lars5@email.com', 'Pass123!', 1, ['Vogels kijken', 'Dieren verzorgen', 'Koken']],
                [6, 'Emma', 'Visser', 22, 'emma6@email.com', 'Pass123!', 2, ['Reizen', 'Muziek', 'Schaken']],
                [7, 'Milan', 'Koopman', 23, 'milan7@email.com', 'Pass123!', 1, ['Lezen', 'Sport', 'Fotografie']],
                [8, 'Sophie', 'Van der Meer', 21, 'sophie8@email.com', 'Pass123!', 3, ['Wandelen', 'Film', 'Kunst']],
                [9, 'Noah', 'De Lange', 24, 'noah9@email.com', 'Pass123!', 2, ['Coderen', 'Tuinieren', 'Muziek']],
                [10, 'Lucas', 'Meijer', 25, 'lucas10@email.com', 'Pass123!', 1, ['Reizen', 'Fotografie', 'Film']],
                [11, 'Julia', 'Van den Broek', 23, 'julia11@email.com', 'Pass123!', 3, ['Lezen', 'Koken', 'Tuinieren']],
                [12, 'David', 'De Boer', 26, 'david12@email.com', 'Pass123!', 2, ['Dieren verzorgen', 'Schaken', 'Wandelen']],
                [13, 'Eva', 'Peters', 21, 'eva13@email.com', 'Pass123!', 1, ['Kunst', 'Sport', 'Lezen']],
                [14, 'Ruben', 'Jansen', 22, 'ruben14@email.com', 'Pass123!', 3, ['Muziek', 'Fotografie', 'Reizen']],
                [15, 'Olivia', 'Hendriks', 24, 'olivia15@email.com', 'Pass123!', 2, ['Film', 'Koken', 'Muziek']],
                [16, 'Tim', 'Bakker', 23, 'tim16@email.com', 'Pass123!', 1, ['Coderen', 'Tuinieren', 'Lezen']],
                [17, 'Zoe', 'Koster', 21, 'zoe17@email.com', 'Pass123!', 3, ['Wandelen', 'Vogels kijken', 'Schaken']],
                [18, 'Thomas', 'De Vries', 22, 'thomas18@email.com', 'Pass123!', 1, ['Sport', 'Coderen', 'Film']],
                [19, 'Maya', 'Van Dijk', 23, 'maya19@email.com', 'Pass123!', 2, ['Muziek', 'Fotografie', 'Reizen']],
                [20, 'Luke', 'Hendriks', 21, 'luke20@email.com', 'Pass123!', 3, ['Koken', 'Lezen', 'Vogels kijken']],
                [21, 'Chloe', 'Peters', 24, 'chloe21@email.com', 'Pass123!', 1, ['Schaken', 'Dieren verzorgen', 'Reizen']],
                [22, 'Ethan', 'Visser', 25, 'ethan22@email.com', 'Pass123!', 2, ['Muziek', 'Wandelen', 'Tuinieren']],
                [23, 'Mila', 'Van den Berg', 20, 'mila23@email.com', 'Pass123!', 3, ['Sport', 'Film', 'Lezen']],
                [24, 'Liam', 'Jansen', 21, 'liam24@email.com', 'Pass123!', 1, ['Fotografie', 'Koken', 'Reizen']],
                [25, 'Fay', 'Koopman', 22, 'fay25@email.com', 'Pass123!', 2, ['Lezen', 'Schaken', 'Tuinieren']],
                [26, 'Jayden', 'Meijer', 23, 'jayden26@email.com', 'Pass123!', 1, ['Muziek', 'Sport', 'Film']],
                [27, 'Vera', 'De Lange', 24, 'vera27@email.com', 'Pass123!', 3, ['Schaken', 'Kunst', 'Vogels kijken']],
                [28, 'Sebastian', 'Van der Meer', 22, 'sebastian28@email.com', 'Pass123!', 1, ['Wandelen', 'Coderen', 'Koken']],
                [29, 'Milan', 'De Boer', 23, 'milan29@email.com', 'Pass123!', 2, ['Reizen', 'Fotografie', 'Sport']],
                [30, 'Zoey', 'Van den Broek', 21, 'zoey30@email.com', 'Pass123!', 3, ['Lezen', 'Schaken', 'Muziek']],
                [31, 'Jay', 'Bakker', 22, 'jay31@email.com', 'Pass123!', 1, ['Film', 'Wandelen', 'Kunst']],
                [32, 'Levi', 'Visser', 21, 'levi32@email.com', 'Pass123!', 2, ['Tuinieren', 'Schaken', 'Muziek']],
                [33, 'Kira', 'Hendriks', 23, 'kira33@email.com', 'Pass123!', 3, ['Vogels kijken', 'Sport', 'Fotografie']],
                [34, 'Max', 'De Vries', 24, 'max34@email.com', 'Pass123!', 1, ['Coderen', 'Reizen', 'Film']],
                [35, 'Sienna', 'Peters', 22, 'sienna35@email.com', 'Pass123!', 2, ['Koken', 'Schaken', 'Muziek']],
                [36, 'Noa', 'Van Dijk', 21, 'noa36@email.com', 'Pass123!', 3, ['Tuinieren', 'Sport', 'Lezen']],
                [37, 'Riley', 'Jansen', 23, 'riley37@email.com', 'Pass123!', 1, ['Fotografie', 'Kunst', 'Film']],
                [38, 'Amira', 'Van den Berg', 22, 'amira38@email.com', 'Pass123!', 2, ['Muziek', 'Schaken', 'Reizen']],
                [39, 'Samuel', 'Koopman', 24, 'samuel39@email.com', 'Pass123!', 3, ['Lezen', 'Tuinieren', 'Vogels kijken']],
                [40, 'Lena', 'Meijer', 25, 'lena40@email.com', 'Pass123!', 1, ['Sport', 'Muziek', 'Coderen']],
                [41, 'Mason', 'Van den Broek', 21, 'mason41@email.com', 'Pass123!', 2, ['Schaken', 'Fotografie', 'Film']],
                [42, 'Ella', 'Hendriks', 23, 'ella42@email.com', 'Pass123!', 3, ['Koken', 'Reizen', 'Wandelen']],
                [43, 'Oscar', 'De Lange', 24, 'oscar43@email.com', 'Pass123!', 1, ['Dieren verzorgen', 'Lezen', 'Schaken']],
                [44, 'Mila', 'De Boer', 22, 'mila44@email.com', 'Pass123!', 2, ['Sport', 'Film', 'Tuinieren']],
                [45, 'Isaac', 'Visser', 21, 'isaac45@email.com', 'Pass123!', 3, ['Muziek', 'Koken', 'Fotografie']],
                [46, 'Amos', 'Bakker', 20, 'amos46@email.com', 'Pass123!', 1, ['Vogels kijken', 'Schaken', 'Lezen']],
                [47, 'Lucy', 'Jansen', 22, 'lucy47@email.com', 'Pass123!', 2, ['Sport', 'Reizen', 'Koken']],
                [48, 'Alex', 'Van Dijk', 24, 'alex48@email.com', 'Pass123!', 3, ['Muziek', 'Tuinieren', 'Schaken']],
                [49, 'Mila', 'Hendriks', 23, 'mila49@email.com', 'Pass123!', 1, ['Film', 'Sport', 'Fotografie']],
                [50, 'Elias', 'De Vries', 21, 'elias50@email.com', 'Pass123!', 2, ['Koken', 'Lezen', 'Muziek']]
            ];

            const insertUsers = fixedUsers.map(user => {
                return new Promise((resolve, reject) => {
                    bcrypt.hash(user[5], saltRounds, (err, hashedPassword) => {
                        if (err) return reject(err);

                        const hobbiesJson = JSON.stringify(user[7]); 
            
                        db.run(`INSERT OR IGNORE INTO Users 
                                (user_id, first_name, last_name, age, email, password, program_id, hobbies) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                            [user[0], user[1], user[2], user[3], user[4], hashedPassword, user[6], hobbiesJson],
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
                [1, 2, 0],
                [1, 3, 0],
                [2, 4, 1],
                [3, 5, 2],
                [4, 6, 0],
                [5, 7, 1],
                [6, 8, 0],
                [7, 9, 1],
                [8, 10, 2],
                [9, 11, 0],
                [10, 12, 1],
                [11, 13, 0],
                [12, 14, 2],
                [13, 15, 1],
                [14, 16, 0],
                [15, 17, 1],
                [16, 18, 2],
                [17, 19, 0],
                [18, 20, 1]
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