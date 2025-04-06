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
            
            const firstNames = ['Daan', 'Sanne', 'Bram', 'Fleur', 'Lars', 'Noa', 'Joris', 'Esmee', 'Thijs', 'Lieke'];
            const lastNames = ['De Vries', 'Jansen', 'Van den Berg', 'Bakker', 'Peters', 'Hendriks', 'Meijer', 'Smit', 'Koning', 'Bos'];
            
            function generatePassword(length = 8) {
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
                let password = '';
                for (let i = 0; i < length; i++) {
                    password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return password;
            }

            for (let i = 1; i <= 50; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const age = Math.floor(Math.random() * (30 - 18 + 1)) + 18;
                const email = `${firstName.toLowerCase()}${i}@email.com`;
                const programId = Math.floor(Math.random() * 3) + 1;
                const hobbies = JSON.stringify(['Lezen', 'Sport', 'Coderen', 'Muziek', 'Fotografie']);
                const password = generatePassword();
                
                db.run(`INSERT OR IGNORE INTO Users (user_id, first_name, last_name, age, email, password, program_id, hobbies) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [i, firstName, lastName, age, email, password, programId, hobbies]
                );
            }

            for (let userId = 1; userId <= 50; userId++) {
                const numCourses = Math.floor(Math.random() * 4) + 2;
                const selectedCourses = new Set();

                while (selectedCourses.size < numCourses) {
                    selectedCourses.add(Math.floor(Math.random() * 10) + 1);
                }

                selectedCourses.forEach(courseId => {
                    db.run(`INSERT OR IGNORE INTO User_Courses (user_id, course_id, date_enrolled) VALUES (?, ?, DATE('now'))`,
                        [userId, courseId]);
                });
            }

            for (let i = 0; i < 20; i++) {
                const user1 = Math.floor(Math.random() * 50) + 1;
                let user2 = Math.floor(Math.random() * 50) + 1;
                while (user2 === user1) user2 = Math.floor(Math.random() * 50) + 1;

                db.run(`INSERT OR IGNORE INTO Friendships (user_id, friend_id, status) VALUES (?, ?, 1)`, [user1, user2]);
            }

            for (let i = 0; i < 30; i++) {
                const sender = Math.floor(Math.random() * 50) + 1;
                let receiver = Math.floor(Math.random() * 50) + 1;
                while (receiver === sender) receiver = Math.floor(Math.random() * 50) + 1;

                const messages = [
                    "Hey, hoe gaat het?",
                    "Wat vond je van het laatste college?",
                    "Wil je samen studeren?",
                    "Heb je de opdracht al af?",
                    "Laten we dit weekend afspreken!",
                    "Ik heb moeite met de database-oefening, kun je helpen?"
                ];
                const messageText = messages[Math.floor(Math.random() * messages.length)];

                db.run(`INSERT OR IGNORE INTO Messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`,
                    [sender, receiver, messageText]);
            }

            console.log("Database succesvol gevuld met testdata!");
        }); // End serialize
    }
});


module.exports = db;