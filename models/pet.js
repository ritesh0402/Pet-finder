const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

const PetSchema = new Schema({
    images: 
        {
            type:String
        }
    ,
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    author: {
        name:{
            type:String
        },
        email:{
            type:String
        } 
    },
    age: {
        type: Number
    },
    name: {
        type: String
    },
    breed: {
        type: String
    },
    location: {
        type: String
    },
    description: {
        type: String
    }
});

//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Pet', PetSchema);