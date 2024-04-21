const rooms = require("../../model/roomsSchema")

// Function to handle adding a new room
const AddRoom = (socket) => {
    socket.on('addrooms', async (data) => {
        try {
            const checkRoom = await rooms.findOne({room_no: data.room_no });
            if(checkRoom){
                socket.emit('addroomerror', 'Please Add Unique Room No. (This Room No is already present)');
                return
            }

            // Create a new room instance with the provided data
            let newroom = new rooms(data)

            // Check if a room with the same floor_no and room_no already exists
            const existingRoom = await rooms.findOne({ floor_no: data.floor_no, room_no: data.room_no });
            if (existingRoom) {
                // Emit an error message if the room already exists
                socket.emit('addroomerror', `Room with room number ${data.room_no} already exists on floor no ${data.floor_no}`);
                return;
            }

            // Save the new room to the database
            const savedRoom = await newroom.save();
            // console.log('Room added successfully:', savedRoom);

            // Retrieve all rooms after adding the new room
            const addedrooms = await rooms.find()

            // Emit success message and updated room list to clients
            socket.emit('addroomsuccess', 'Room added successfully:', addedrooms)
        } catch (error) {
            // Emit an error message if an error occurs during room addition
            socket.emit('addroomerror', 'Error Adding room');
        }
    });
}

// Function to handle updating an existing room
const UpdateRoom = (socket) => {
    socket.on('updaterooms', async (data) => {
        try {
            // Find and update the room based on floor_no and room_no
            const updatedRoom = await rooms.findOneAndUpdate(
                { floor_no: data.floor_no, room_no: data.room_no },
                { $set: { category: data.category, price: data.price, status: data.status } },
                { new: true }
            );

            if (updatedRoom) {
                // Retrieve all rooms after updating
                const addedrooms = await rooms.find()

                // Emit success message and updated room list to clients
                socket.emit('updateroomsuccess', 'Room Updated successfully:', addedrooms);
            } else {
                // Emit an error message if the room is not found or update fails
                socket.emit('addroomerror', 'Room not found or update failed');
            }
        } catch (error) {
            // Emit an error message if an error occurs during room update
            socket.emit('addroomerror', 'Error Updating room');
        }
    });
}

// Function to handle deleting a room
const DeleteRoom = (socket) => {
    socket.on('deleterooms', async (data) => {
        try {
            // Find and delete the room based on floor_no and room_no
            const deletedRoom = await rooms.findOneAndDelete({ floor_no: data.floor_no, room_no: data.room_no });

            if (deletedRoom) {
                // Retrieve remaining rooms after deletion
                const remainingRooms = await rooms.find();

                // Emit success message, updated room list, and clear signal to clients
                socket.emit('updateroomsuccess', 'Room deleted successfully', remainingRooms, "clear");
            } else {
                // Emit an error message if the room is not found or deletion fails
                socket.emit('addroomerror', 'Room not found or deletion failed');
            }
        } catch (error) {
            // Emit an error message if an error occurs during room deletion
            socket.emit('addroomerror', 'Error deleting room');
        }
    })
}

// Function to handle searching for a room by room number
const SearchRoom = (socket) => {
    socket.on('searchroomvalue', async (searchroomvalue) => {
        try {
            // Find the room by room number
            const searchedroom = await rooms.find({ room_no: searchroomvalue })
            if (searchedroom.length > 0) {
                // Emit the found room details to clients
                socket.emit('searchroomsuccess', searchedroom)
            } else {
                // Emit an error message if the room is not found
                socket.emit('addroomerror', `Room Number ${searchroomvalue} not found `);
            }
        } catch (error) {
            // Emit an error message if an error occurs during room search
            socket.emit('addroomerror', 'Error Searching room');
        }
    })
}

// Function to handle displaying all rooms
const DisplayRooms = (socket) => {
    socket.on('displayrooms', async () => {
        try {
            // Retrieve all rooms from the database
            const displayrooms = await rooms.find()

            // Emit the list of rooms to clients
            socket.emit('displayroom', displayrooms)
        } catch (error) {
            // Emit an error message if an error occurs during room retrieval
            socket.emit('addroomerror', 'Could not clear Room table please refresh');
        }
    })
}

// Export all Socket.io event handler functions
module.exports = { AddRoom, UpdateRoom, DeleteRoom, SearchRoom, DisplayRooms }