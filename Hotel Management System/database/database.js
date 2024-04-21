const mongoose = require("mongoose")

const {MONGO_URI} = process.env

const database=
mongoose.connect(MONGO_URI)
.then(() =>{
    console.log("Successfully connected to database")
}).catch((error) =>{
    console.log(error)
    console.log("database connection failed. exiting now...")
});

module.exports=database;