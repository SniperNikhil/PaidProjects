const express = require("express")
const router = express.Router();

const users = require("../../model/userSchema");

router.post("/updateprofile",async (req,res)=>{
    try {
        let update = await users.updateOne({},{
            $set:{
                name:req.body.name
            }
        })
        res.render("profile",{
            name:req.body.name
        })
    } catch (error) {
        res.render("profile",{
            err:"Could Not Update"
        })
    }
})

module.exports = router;