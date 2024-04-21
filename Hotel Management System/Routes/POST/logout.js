const express = require("express")
const router = express.Router();

router.post("/Logout",(req,res)=>{
    res.clearCookie('accesstoken')
    res.redirect("/");
})

module.exports = router;