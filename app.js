var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const forms = require('multer')

const AuthRouter = require('./routes/Auth');
const MainRouter = require('./routes/Main'); 
const FileRouter = require('./routes/Main/FileRoute')
// const TestRouter = require('./test')

var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use("/img",express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(forms().array())



// parse application/json


const Mongoose = mongoose.connect('mongodb://localhost:27017/Quill_DB',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,  useFindAndModify: false }
    );

Mongoose.then(err=>{
        console.log("Connected to DB");
    }).catch(err=> console.log(err)); 



app.use('/auth', AuthRouter);
// app.use('/sample', TestRouter);
app.use('/file', FileRouter);
app.use('/', MainRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
