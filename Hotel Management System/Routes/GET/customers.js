const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const customers = require("../../model/customerSchema")

router.get("/customers",auth,async(req,res) =>{
    const addedcustomers = await customers.find() 
    res.render("customers",{
        addedcustomers
    });
})

module.exports=router;