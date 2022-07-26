const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

const PetSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    breed: {
        type: String
    },
    location: {
        type: String
    }
});

//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Pet', PetSchema);