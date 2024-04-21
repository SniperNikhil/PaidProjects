const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const checkin = require("../../model/checkinSchema")

router.get("/checkout",auth,async(req,res) =>{
    const checkedinfloor = await checkin.find().select("floorNo")
    const uniquefloorno = Array(...new Set(checkedinfloor.map(item => item.floorNo)))

    const checkedinroom = await checkin.find({status:"active"}).select("roomNo")

    res.render("checkout",{
        uniquefloorno,
        checkedinroom
    });
})

module.exports=router;