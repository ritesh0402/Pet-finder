if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express=require('express');
const app=express();
const path=require('path');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
var multer= require("multer");
const {storage} = require('./cloudinary');
const upload = multer({storage});
app.use(express.static('public'));
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder=  mbxGeocoding({accessToken : mapBoxToken })

const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport(
{
	service:"hotmail",
	auth:{
		user:"node1234561@outlook.com",
		pass:"@NodeMail123"
	}
});

const options={
	from:"node1234561@outlook.com",
	to:"reciever2022@outlook.com",
	subject:"Request Acknowledgement",
	text:"Your request for adoption is recieved and you will get to know more details in 3-4 days"
};

const bodyParser = require("body-parser");
app.use(express.urlencoded());
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

const Pet = require('./models/pet');
// Passport
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

  
// passport ends  

// Routes
// app.use('/', require('./routes/index.js'));
// app.use('/users', require('./routes/users.js'));

// app.get('/test',(req,res)=>res.render('test.ejs'))
const mongoose = require('mongoose');
const { urlencoded } = require('express');
mongoose.connect('mongodb://localhost:27017/need17', {useNewUrlParser: true})
.then(()=>{
    console.log("Connection established");
})
.catch(err=>{
    console.log("error");
    console.log(err);
})



app.get('/',(req,res)=>
res.render("home.ejs"))

app.get('/aboutUs',(req,res)=>
res.send(__dirname + '/index.html'))

//Adopt 
app.get('/adopt',async(req,res)=> {
const pet = await Pet.find({})
res.render('adopt.ejs', {pet})
})

//Add a New
app.get('/adopt/new',(req,res)=>
res.render("newPet.ejs"))

app.get('/adopt/new/add',async (req, res) => {
    const newPet = new Pet(req.query);
    await newPet.save();
    res.redirect('/adopt');
})

app.get('/donate',(req,res)=>
res.render("donate.ejs"))


app.get('/contact',(req,res)=>
{
  
  transporter.sendMail(options,function(err,info)
  {
    if(err) 
    {
      console.log(err)
      return;
    }
    console.log("Sent:"+info.response)
  }) 
  res.render('home.ejs');
})

app.get('/adopt/contact',(req,res)=>
{
  
  transporter.sendMail(options,function(err,info)
  {
    if(err) 
    {
      console.log(err)
      return;
    }
    console.log("Sent:"+info.response)
  }) 
  res.render('home.ejs');
}

)


const User = require('./models/User');
const { forwardAuthenticated } = require('./config/auth');

// Login Page
app.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
app.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
app.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });

  }
   else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res,next) => {
  req.logout(function(err){
    if(err) {return next(err);}
  });
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});
app.listen(3000,()=>console.log("Server Up and Running"));