const mongoose = require("mongoose")

const room = new mongoose.Schema({
    roomid: { type: Number, unique: true },
    category:{type:String,required: true},
    floor_no:{type:String,required: true},
    room_no:{type:String,required: true,unique:true},
    price:{type:Number,required: true,min:0},
    status:{type:String}
})

// Pre-save middleware to automatically generate roomid
room.pre('save', async function(next) {
    try {
        // Check if roomid is not already assigned
        if (!this.roomid) {
            const Room = mongoose.model('Room', room);

            // Find the highest roomid in the collection
            const highestRoom = await Room.findOne({}, { roomid: 1 }, { sort: { roomid: -1 } });

            // Set the new roomid to be one greater than the highest existing roomid
            this.roomid = (highestRoom && highestRoom.roomid ? parseInt(highestRoom.roomid) + 1 : 1).toString();
        }
        next();
    } catch (err) {
        next(err);
    }
});

const rooms = mongoose.model('rooms',room)

module.exports = rooms