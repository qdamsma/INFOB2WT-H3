var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var projectRouter = require('./routes/project');
var usersRouter = require('./routes/users');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/project', projectRouter);
app.use('/users', usersRouter);


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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
