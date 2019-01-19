require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var MongoClient = require('mongodb').MongoClient;
const Snapshot = require('./models').Snapshot;

Snapshot.findOne({
    attributes: ['time'],
    order: [['time','DESC']]
}).then((res) => {
    let fromTime = res.time;
    MongoClient.connect(process.env.MONGODB_URI)
        .then(function (client) { // <- db as first argument
            let db = client.db();
            const collection = db.collection('weather');
            collection.find({'currently.time': {$gt: fromTime}},{projection: {'currently': 1, '_id': 0}}).toArray(function(err, docs) {
                let snapshots = docs.map((doc) => {
                    return doc.currently;
                });

                Snapshot
                    .bulkCreate(snapshots)
                    .then(() => {
                        console.log("Weather saved.")
                    })
                    .catch(() => {
                        console.log("Something went wrong. Weather not saved.")
                    });
            });

        })
        .catch(function (err) {
            console.log(err);
        });
}).catch((e) => {
    console.log('Error during fetching fromTime');
    console.log(e);
});





module.exports = app;
