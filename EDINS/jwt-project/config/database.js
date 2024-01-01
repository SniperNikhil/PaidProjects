//This is the database Connection File for connecting to database 
//we are using package called mongoose
//import the mongoose package
const mongoose = require("mongoose");

//Here im getting the mongodb url so that i can use it for connecting
//that database
//im importing the url from .env file 
const { MONGO_URI } = process.env;

//Here im exporting the connection so that i can make use of this connection 
//in my other file too
exports.connect = () => {
  // Connecting to the database
  mongoose  
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

//We have used
//this is syntax
//mongoose.connect(mongodburl,{})
//Connecting to database may sometimes return an exception
//So to Handle this we have used one method of exception handling
//i.e  .then().catch((error) => {})

//So here we have made Succesfull Connection with our database