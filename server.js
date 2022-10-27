if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
var multer= require("multer");
const {storage} = require('./cloudinary/cloud');
const upload = multer({storage});
app.use(express.static('public'));
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder=  mbxGeocoding({accessToken : mapBoxToken })
const MongoStore = require('connect-mongo')
const passport = require('passport')

const {ensureAuth, ensureGuest} = require('./auth')




//Some Setup
const bodyParser = require("body-parser");
app.use(express.urlencoded());
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended:true
}))
app.use(bodyParser.json());



// Passport Config
require('./config/passport')(passport);

//Express Session
app.use(session({
  secret: 'harsh',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://harsh:%40Harsh2502@cluster0.pbfqw5x.mongodb.net/test?retryWrites=true&w=majority",
  })
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


// DB Config
const db = require('./config/keys').mongoURI;

const Pet = require('./models/pet');
const Care = require('./models/care');

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

  
//Mpngoose Connection
const mongoose = require('mongoose');
const { urlencoded } = require('express');
mongoose.connect('mongodb+srv://harsh:%40Harsh2502@cluster0.pbfqw5x.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
.then(()=>{
    console.log("Connection established");
})
.catch(err=>{
    console.log("error");
    console.log(err);
})

//Routes

//Home
app.get('/home',(req,res)=>
{
  res.render('home')
})

//About Us
app.get('/aboutUs',ensureAuth,(req,res)=>res.send(__dirname + '/index.html'))

//Adopt 
app.get('/adopt',ensureAuth,async(req,res)=> {
const pet = await Pet.find({})
res.render('adopt.ejs', {pet,user:req.user.email})
})

//Add a New
app.get('/adopt/new',ensureAuth,(req,res)=>{
  console.log(req.user)
  res.render("newPet.ejs")
}
)

//Add a New Pet Actual Request
app.post('/adopt/new/add',(upload.single('image')),async (req, res) => {
    console.log(req.file.path)
    const temp={
      name:req.body.name,
      images: req.file.path,
      breed:req.body.breed,
      age: req.body.age,
      location: req.body.location,
      description: req.body.description ,
      author:{name:req.user.firstName,email:req.user.email}
    }
    const newPet = new Pet(temp);
    await newPet.save();
    res.redirect('/adopt');
})


//Donate
app.use('/payment',ensureAuth,require('./routes/paytm'))

//Delete
app.post('/delete',async (req,res)=>{
  await Pet.findByIdAndDelete(req.body.unique)
  res.redirect('/adopt')
})

//Contact
app.get('/contact',ensureAuth,(req,res)=>
{ 
  res.redirect(`https://mail.google.com/mail/?view=cm&fs=1&to=${req.query.author}`)
})

//Contact in Adoption Page
app.post('/adopt/contact',ensureAuth,(req,res)=>
{
  
  //Nodemailer
  const {name,breed,age,location}=req.body
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
    to:`${req.user.email}`,
    subject:"Request Acknowledgement",
    text:`Your request for adoption of is recieved and you will get to know more details in 3-4 days\n
    \nLocation: ${location},
    \nName: ${name},
    \nBreed: ${breed},
    \nAge: ${age}
    `
  };

  transporter.sendMail(options,function(err,info)
  {
    if(err) 
    {
      console.log(err)
      return;
    }
    console.log("Sent:"+info.response)
  }) 
  res.redirect('/home');
}

)


//Search in Adoption Page
app.post('/search',ensureAuth,async(req,res)=>{
  const { location } = req.body;
  const pet = await Pet.find({"location" : location})
  res.render('adopt.ejs', {pet,user:req.user.email})
})

//NGO Page
app.get('/ngo',(req,res)=>{
  res.render('ngo')
})

//Pet Care
app.get('/care',async(req,res)=>{
  const care = await Care.find({})
  res.render('care.ejs', {care,user:req.user.email})
})

//Pet Care new
app.get('/care/new',ensureAuth,(req,res)=>{
  console.log(req.user)
  res.render("newCare.ejs")
})

//Add a New Pet Actual Request
app.post('/care/new/add',(upload.single('image')),async (req, res) => {
  console.log(req.file.path)
  const temp={
    name:req.body.name,
    images: req.file.path,
    service:req.body.service,
    cost: req.body.cost,
    location: req.body.location,
    description: req.body.description ,
    author:{name:req.user.firstName,email:req.user.email}
  }
  const newCare = new Care(temp);
  await newCare.save();
  res.redirect('/care');
})

//Search Care
app.post('/care/search',ensureAuth,async(req,res)=>{
  const { location } = req.body;
  const care = await Care.find({"location" : location})
  res.render('care.ejs', {care,user:req.user.email})
})

//Care Contact

app.get('/care/contact',ensureAuth,(req,res)=>
{ 
  res.redirect(`https://mail.google.com/mail/?view=cm&fs=1&to=${req.query.author}`)
})


//Delete Care
app.post('/care/delete',async (req,res)=>{
  await Care.findByIdAndDelete(req.body.unique)
  res.redirect('/care')
})



app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))


app.listen(3000,()=>console.log("Server Up and Running"));

















