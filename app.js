let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let driver = require('./neo4j')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let writeRouter = require('./routes/write');
let deleteRouter = require('./routes/delete');
let editRouter = require('./routes/edit');

let app = express();

const uri = 'neo4j://localhost:7687'
const name = 'neo4j'
const password = 'test'

driver.initDriver(uri, name, password)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/write', writeRouter);
app.use('/delete', deleteRouter);
app.use('/edit', editRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
