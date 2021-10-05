require("dotenv").config() // load stuff from .env into process.env

const express = require('express');
const logger = require('morgan');
const cors = require("cors")

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Connect to DB
const mongoose = require('mongoose')

const strConn = process.env.MONGO_URI || 'mongodb://localhost/users_media_db'
mongoose.connect(strConn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("Connection to database established!"))
.catch((err) => console.log("[ERROR] Connection to database failed!", err.message))


app.use(cors({ 
  // origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' 
}))
app.use(logger('dev'));
app.use(express.json( { limit: '1MB' }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({error: err.message || err})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`API has started on port ${PORT}`))
