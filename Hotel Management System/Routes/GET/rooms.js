const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const rooms = require("../../model/roomsSchema")

router.get("/rooms",auth,async(req,res)=>{ 
    const addedrooms = await rooms.find()  
    res.render("rooms",{
        addedrooms
    });
})

module.exports=router;