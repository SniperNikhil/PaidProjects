//Here we are defining the Schema of database
//i.e In what structure we are going to store our data in database
//Note it is nessesary to define the Schema while using the mongoose package
//if you miss one element in Schema that element will not be visible in database
// also it will not give any errors so Note this

//import mongoose
const mongoose = require("mongoose");

//Here we are defining Schema for Teacher Database collection(table)
//each data here is in the form of String
//We have used mongoose.Schema({}) to define the schema
const teacherSchema = new mongoose.Schema({
    first_name: { type: String, default: null },        //We have follwing elements in our
    last_name: { type: String, default: null },         //teachers collection(table)
    dob: { type: String, default: null },
    email: { type: String,unique:true, default: null },
    password: { type: String },
    gender: { type: String },
    phone: { type: String },
    pagePhoto: {type: String,default: ""},           //we are adding image name in our database 
    address: { type: String },                          //so that we can make use of it while displaying
    city: { type: String },                             //the image in interface
    zipcode: { type: String },
    token: { type: String },
});

//Here we are defining Schema for Student Database collection(table)
//each data here is in the form of String
//We have used mongoose.Schema({}) to define the schema
const studentSchema = new mongoose.Schema({
    studentid: { type: String, default: null },     //We have following elements in our
    first_name: { type: String, default: null },    //Students collection(table)
    last_name: { type: String, default: null },
    gender: { type: String , default: null},
    dob: { type: String , default: null},
    sem: { type: String , default: null},
    email: { type: String,unique:true, default: null },
    password: { type: String },
    phone: { type: String , default: null},
    pagePhoto: {type: String,default: ""},       //we are adding image name in our database 
    address: { type: String , default: null},                      //so that we can make use of it while displaying
    city: { type: String , default: null},                         //the image in interface
    zipcode: { type: String , default: null},
    token: { type: String , default: null},
    collegename:{type: String, default: null},
});

//Here we are defining Schema for Admin Database collection(table)
//each data here is in the form of String
//We have used mongoose.Schema({}) to define the schema
const adminSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    licence_key: { type: String, default: null },
    email: { type: String, default: null,unique:true },
    password: { type: String },
    token: { type: String },
    phone: { type: String },
    pagePhoto: {type: String,default: ""},      //we are adding image name in our database
    dob: { type: String },                         //so that we can make use of it while displaying
    address: { type: String },                     //the image in interface
    city: { type: String },
    zipcode: { type: String },
    collegename:{type: String, default: null}
});

//Note we have 3Schemas here to export all 3 at a time
//first we will create objects to 3 of them
//Note: Now whenever we want to access element from database we will be using these objects
const admins = mongoose.model('admins', adminSchema);
const student = mongoose.model('students', studentSchema);
const teacher = mongoose.model('teachers', teacherSchema);
//mongoose.model('collection_name',defined_Schema)

module.exports = {              //Here we are exporting all 3 Schema objects at a time 
    admins, student, teacher    //so that we can make use of it in other files
}

//Note the Syntax to export multiple routes
//It will be Difficult to trace if you export all 3 separately
