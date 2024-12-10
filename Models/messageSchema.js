const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true,
        minLength : [3 , "First name must conatin at least 3 Characters"]
    },
    lastName : {
        type : String,
        required : true,
        minLength : [3 , "First name must conatin at least 3 Characters"]
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail , "Please Provide a valid email"]
    },
    phone : {
        type : Number,
        required : true,
        minLength : [10 , "Phone number  must conatin exact 10 digits"]

    },
    message : {
        type : String,
        required : true,
        minLength : [10 , "message must contain  at least 10 characters"]

    }


});

module.exports = mongoose.model("Message", messageSchema);
