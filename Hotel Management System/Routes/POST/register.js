const express = require("express")
const path = require("path")
const bcrypt = require('bcryptjs');

const router = express.Router();
const users = require("../../model/userSchema");

router.post("/Reg",async (req,res)=>{
    try {
        var scriptval = '<script>showSuccessMessage();</script>'
        var olduser = await users.find().count();
        // console.log(olduser)
        if(olduser>0){
            res.render("register",{
                list:"Only one user can register,please login",
                script:scriptval
            })
        }else{
            var encryptedPassword = await bcrypt.hash(req.body.password,10);
            var user =new users({
                name :req.body.name,
                password :encryptedPassword
            }) 
        
            var saveduser=await user.save()
        
            res.render("register",{
                list:"Successfully Registered",
                script:scriptval
            })
        }       
    } catch (error) {
        console.log(error)
        res.render("register",{
            list:error,
            script:scriptval
        })
    }
})

module.exports = router;