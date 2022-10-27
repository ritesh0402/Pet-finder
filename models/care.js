const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

const CareSchema = new Schema({
    images: 
        {
            type:String
        }
    ,
    author: {
        name:{
            type:String
        },
        email:{
            type:String
        } 
    },
    cost: {
        type: Number
    },
    name: {
        type: String
    },
    service: {
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

module.exports = mongoose.model('Care', CareSchema);