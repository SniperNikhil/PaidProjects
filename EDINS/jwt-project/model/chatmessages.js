const mongoose = require("mongoose");

const chatgroupmessage = mongoose.Schema(
    {
        groupname: { type: String },
        message: {
            text: { type: String, required: true },
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderemail: { type: String },
    },
    {
        timestamps: true,
    }
);

chatgroupmessage.index({ groupname: 1 }); // Create unique index on groupname field

module.exports = mongoose.model("GpMessage", chatgroupmessage);