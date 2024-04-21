const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const rooms = require("../../model/roomsSchema")
const checkin = require("../../model/checkinSchema")

router.get("/checkin",auth,async(req,res) =>{
    const availableroom = await rooms.find({status:"Available"}).select("room_no category")
    const checkedin = await checkin.find({status:"active"})
    res.render("checkin",{
        availableroom,
        checkedin
    });
})

module.exports=router;