const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    empcode: {type:String,unique:true},
    designation: {type:String},
    doj: {type:String},
    name: {type:String},
    dob: {type:String},
    age: {type:String},
    experience: {type:String},
    gender: {type:String},
    proffid: {type:String},
    email: {type:String,unique:true},
    contact: {type:String},
    address: {type:String},
    month: {type:String},
    year: {type:String},
    bsal: {type:String},
    tdays: {type:String},
    absents: {type:String},
    medical: {type:String},
    pfund: {type:String},
    convence: {type:String},
    netsalary: {type:String},
    password:{type:String},
});

const adminSchema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null,unique:true },
    password: { type: String },
    user: {type: String}
});

const employee = mongoose.model('employee',employeeSchema);
const admins = mongoose.model('admins', adminSchema);

module.exports = {
    employee,admins
};