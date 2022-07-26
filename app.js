if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express=require('express');
const app=express();
const path=require('path');
app.use(express.static('public'));
//var  express=require('partials');
// const mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost:27017/products')
//   .then(()=>
//   {
//     console.log("Connection Open")
//   })
//   .catch(err=>
//   {
//     console.log(err);
//   })

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nfc17', {useNewUrlParser: true})
.then(()=>{
    console.log("Connection established");
})
.catch(err=>{
    console.log("error hi bhai ");
    console.log(err);
})

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/',(req,res)=>
res.render("home.ejs"))

app.get('/aboutUs',(req,res)=>
res.render("home.ejs"))

app.get('/register',(req,res)=>
res.render("register.ejs"))

app.get('/logIn',(req,res)=>
res.render("login.ejs"))

app.get('/adopt',(req,res)=>
res.render("adopt.ejs"))

app.get('/adopt/new',(req,res)=>
//res.render("adopt.ejs"))
res.send("adopt_new"))

app.get('/donate',(req,res)=>
res.render("donate.ejs"))

app.listen(3000,()=>console.log("Server Up and Running"));