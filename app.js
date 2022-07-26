const express=require('express');
const app=express();
const path=require('path');
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
res.send("Home Page"))

app.listen(3000,()=>console.log("Server Up and Running"));