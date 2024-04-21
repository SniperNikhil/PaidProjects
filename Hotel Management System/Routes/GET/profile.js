const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const user = require("../../model/userSchema")

router.get("/profile", auth, async (req, res) => {
    let result = await user.findOne().select('name');

    res.render("profile",{
        name:result.name
    })
})

module.exports = router;