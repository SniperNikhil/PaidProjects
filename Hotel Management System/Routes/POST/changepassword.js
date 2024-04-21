const express = require("express")
const path = require("path")
const bcrypt = require('bcryptjs');

const router = express.Router();
const users = require("../../model/userSchema");

router.post("/changepassword", async (req, res) => {
    var encryptedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        var updatedUser = await users.findOneAndUpdate({}, { password: encryptedPassword }, { new: true });

        if (!updatedUser) {
            return res.render("profile", {
                list: "Could Not Update Password",
            });
        }

        res.render("profile", {
            list: "Password Changed Successfully",
        });
    } catch (error) {
        res.render("profile", {
            list: "Failed to update password",
        });
    }
})

module.exports = router;