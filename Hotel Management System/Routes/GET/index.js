const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const rooms = require("../../model/roomsSchema")
const customers = require("../../model/customerSchema")
const checkin = require("../../model/checkinSchema")

router.get("/index",auth,async(req,res) =>{
    const allrooms = await rooms.find().count()
    const allCustomers = await customers.find().count();
    const allCheckin = await checkin.find({status:"active"});
    res.render("index",{
        allrooms,
        allCustomers,
        allCheckin
    });
})

module.exports=router;