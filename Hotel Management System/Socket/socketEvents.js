const {AddRoom,UpdateRoom,DeleteRoom,SearchRoom,DisplayRooms} = require('../Routes/POST/rooms');
const {AddCustomer,UpdateCustomer,DeleteCustomer,SearchCustomer,DisplayCustomers} = require('../Routes/POST/customers');
const {checkinview,fetchroom,Bill,CheckIn,DisplayCheckin,SearchCheckin,CheckInUpdate,CheckInDelete} = require('../Routes/POST/checkin')
const {SearchCheckedin,CheckOut,UpdateCheckoutrooms} = require('../Routes/POST/checkout')


module.exports = function(io) {
    io.on('connection', socket => {
        //Accessing the Rooms
        AddRoom(socket);
        UpdateRoom(socket)
        DeleteRoom(socket)
        SearchRoom(socket)
        DisplayRooms(socket)
        AddCustomer(socket)
        UpdateCustomer(socket)
        DeleteCustomer(socket)
        SearchCustomer(socket)
        DisplayCustomers(socket)
        checkinview(socket)
        fetchroom(socket)
        Bill(socket)
        CheckIn(socket)
        DisplayCheckin(socket)
        SearchCheckin(socket)
        CheckInUpdate(socket)
        CheckInDelete(socket)
        SearchCheckedin(socket)
        CheckOut(socket)
        UpdateCheckoutrooms(socket)
    });
};