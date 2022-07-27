const mongoose = require("mongoose");
const cities = require("./cities");

const pet = require("../models/pet");

mongoose.connect('mongodb://localhost:27017/need17', {useNewUrlParser: true})
.then(()=>{
    console.log("Connection established");
})
.catch(err=>{
    console.log("error");
    console.log(err);
})
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
  await pet.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 50);
    const price= Math.floor(Math.random()*20)+10;
    const camp = new pet({
      location: `${cities[random1000].City},${cities[random1000].State}`,
      breed:`Golden Retriever`,
      
      geometry:{
        type:"Point",
        coordinates:[cities[random1000].Longitude,cities[random1000].Latitude]
      },

      images:"https://images.unsplash.com/photo-1610202456838-08e8d12a8b0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=877&q=80",
      
      description:'Lorem ipsum dolor sit amem?',
      age:4
    });

    await camp.save();
  }
};

seedDB().then(()=>{mongoose.connection.close()});