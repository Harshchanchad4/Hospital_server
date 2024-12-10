const mongoose = require("mongoose");
require("dotenv").config();
 
console.log("MONGODB " , process.env.MONGODB_URL);

exports.connect = () => {
    mongoose.connect( process.env.MONGODB_URL , {
      
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
         console.log(error);
         process.exit(1);
    } )
};                              