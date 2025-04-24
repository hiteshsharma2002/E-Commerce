const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');
const router = require('./routes/admin');
const router1 = require('./routes/user');
app.use(express.static('public'));
app.set('view engine', 'ejs');


// middleware bodyParser

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.set("views", path.join(__dirname, "views"));

// ------------------------------------------------- session

app.use(
    session({
      secret: "hitesh2822", // Replace with a secure, randomly generated key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 24*60*60*1000 }, // Set `secure: true` only if using HTTPS
    })
  );

// ------------------------------------------ mongoose connect

mongoose
  .connect("mongodb://localhost:27017/ECommerce")
  .then(() => console.log("MongoDb Connected"))
  .catch(() => console.log("Error occured while connecting with mongodb"));

app.use((req, res, next) => {
  const userEmail = req.session.userEmail;
  if (userEmail) {
    req.email = userEmail.email;
  }
  next();
});

app.use('/admin', router);
app.use('/user', router1);


app.get('/', function (req, res) {
    res.render('index');
})





app.listen(1400, () => {
    console.log('Server is Connected');
})
