const express = require("express")
const user = require("../../model/userSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const customers = require("../../model/customerSchema")
const rooms = require("../../model/roomsSchema")
const checkin = require("../../model/checkinSchema")
const router = express.Router()

router.use(cookieParser())
router.post("/login", async (req, res) => {
    try {
        // var scriptval = '<script>showSuccessMessage();</script>'
        var scriptval = 'showSuccessMessage();'
        let { name, pass } = req.body;
        const checkuser = await user.findOne({ name: name })
        if (checkuser && await bcrypt.compare(pass, checkuser.password)) {
            const token = await jwt.sign(
                {
                    userId: name
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            const allrooms = await rooms.find().count()
            const allCustomers = await customers.find().count();
            const allCheckin = await checkin.find({status:"active"});
            // console.log(token)
            res.cookie('accesstoken', token)
            res.render("index", {
                allCustomers,
                allrooms,
                allCheckin
            })
        } else {
            res.render("login", {
                list: "Invalid UserName or password",
                script: scriptval
            })
        }
    } catch (error) {
        res.render("login", {
            list: "Couldn't Login Try Again",
            script: scriptval
        })
    }
})


module.exports = router