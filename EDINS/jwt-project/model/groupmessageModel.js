const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema(
  {
    groupname: { type: String, unique: true }, // Set unique attribute for primary key
    users: Array,
  }
);
GroupSchema.index({ groupname: 1 }); // Create unique index on groupname field

module.exports = mongoose.model("ChatGroup", GroupSchema);

