var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var projectRouter = require('./routes/project');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');
var programsRouter = require('./routes/programs');
var messagesRouter = require('./routes/messages');
var friendsRouter = require('./routes/friends');
var user_coursesRouter = require('./routes/user_courses');


var app = express();

app.use(session({
  secret: 'stoelpoot35',
  resave: false,
  saveUninitialized: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/project', projectRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use('/programs', programsRouter);
app.use('/messages', messagesRouter);
app.use('/friends', friendsRouter);
app.use('/user_courses', user_coursesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
});

app.post('/users', (req, res) => {
  const { first_name, email } = req.body;
  db.run('INSERT INTO users (first_name, email) VALUES (?, ?)', [first_name, email], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID, first_name, email });
  });
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err); // voor debuggen
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'views', 'error.html')); 
});

module.exports = app;
