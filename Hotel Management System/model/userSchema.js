const mongoose = require("mongoose")

const user = new mongoose.Schema({
    name:{type:String},
    password:{type:String}
})

const users = mongoose.model('users',user)

module.exports= users