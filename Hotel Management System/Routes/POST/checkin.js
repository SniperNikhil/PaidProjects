const customers = require("../../model/customerSchema");
const rooms = require("../../model/roomsSchema")
const checkin = require("../../model/checkinSchema")

const checkinview = (socket) => {
    socket.on("viewcustomer", async (data) => {
        try {
            const customer = await customers.findOne({ $or: [{ custid: data }, { contact: data }] });

            if (customer) {
                socket.emit('displayview', customer);
            } else {
                socket.emit("viewerror", "Could not find customer");
            }
        } catch (error) {
            socket.emit("viewerror", "Could not view. Please try again.");
        }
    });
};

const fetchroom = (socket) => {
    socket.on("fetchroomdata", async (data) => {
        try {
            const roomdata = await rooms.findOne({ room_no: data })

            if (roomdata) {
                socket.emit('displayfetchroom', roomdata);
            } else {
                socket.emit("viewerror", "Could not find Room of the given id");
            }
        } catch (error) {
            socket.emit("viewerror", "Could not Fetch. Please try again.");
        }
    })
}

const Bill = (socket) => {
    function calculateNumberOfDays(checkInDate, checkOutDate) {
        // Parse the check-in and check-out dates into JavaScript Date objects
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);

        // Calculate the difference in time (in milliseconds) between the two dates
        const timeDifference = endDate.getTime() - startDate.getTime();

        // Convert the time difference from milliseconds to days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return daysDifference;
    }
    socket.on("Bill", (data) => {
        try {
            const numberOfDays = calculateNumberOfDays(data.checkInDate, data.checkOutDate);
            const total = numberOfDays * data.price
            const balance = total - data.advance
            const resultData = {
                total, balance
            }
            socket.emit("totalbalance", resultData)
        } catch (error) {
            socket.emit("viewerror", "Error. Please try again.");
        }
    })
}

const CheckIn = (socket) => {
    socket.on("CheckInData", async (data) => {
        try {
            // console.log(data)
            let newCheckin = new checkin(data);

            const existingCheckin = await checkin.findOne({ $and: [{ floorNo: data.floorNo }, { roomNo: data.roomNo }] });
            // console.log(existingCheckin)
            if (existingCheckin) {
                if (existingCheckin.status == 'inactive') {
                    const updatedCheckin = await checkin.findOneAndUpdate(
                        { $and: [{ floorNo: data.floorNo }, { roomNo: data.roomNo }] },
                        {
                            $set: {
                                cname: data.cname,
                                contact: data.contact,
                                category: data.category,
                                roomNo: data.roomNo,
                                price: data.price,
                                floorNo: data.floorNo,
                                checkInDate: data.checkInDate,
                                checkOutDate: data.checkOutDate,
                                total: data.total,
                                balance: data.balance,
                                advance: data.advance,
                                status:"active"
                            }
                        },
                        { new: true }
                    );

                    const updatedRoom = await rooms.findOneAndUpdate(
                        { floor_no: data.floorNo, room_no: data.roomNo },
                        { $set: { status: "Not Available" } },
                        { new: true }
                    );

                    const roomdata = await rooms.find({ status: "Available" })
                    const allCheckin = await checkin.find({ status: "active" });

                    socket.emit('addcheckinsuccess', 'Checked in successfully', allCheckin, roomdata);
                    return;
                } else {
                    socket.emit('viewerror', `Checkin with Floorno ${data.floorNo} and roomno ${data.roomNo} already ocupied`);
                    return;
                }

            }

            const savedCheckin = await newCheckin.save();

            const updatedRoom = await rooms.findOneAndUpdate(
                { floor_no: data.floorNo, room_no: data.roomNo },
                { $set: { status: "Not Available" } },
                { new: true }
            );

            const roomdata = await rooms.find({ status: "Available" })
            const allCheckin = await checkin.find({ status: "active" });

            socket.emit('addcheckinsuccess', 'Checked in successfully', allCheckin, roomdata);
        } catch (error) {
            console.log(error)
            socket.emit("viewerror", "Could not Checkin");
        }
    })
}

const DisplayCheckin = (socket) => {
    socket.on('displaycheckin', async () => {
        try {
            // Retrieve all rooms from the database
            const displaycheckin = await checkin.find({ status: "active" })
            const roomdata = await rooms.find({ status: "Available" })

            // Emit the list of rooms to clients
            socket.emit('searchcheckinsuccess', displaycheckin, roomdata)
        } catch (error) {
            // Emit an error message if an error occurs during room retrieval
            socket.emit('viewerror', 'Could not clear Checkin table please refresh');
        }
    })
}

const SearchCheckin = (socket) => {
    try {
        socket.on("searchcheckinvalue", async (searchcontact) => {
            const searchedcheckin = await checkin.find({ contact: searchcontact })
            if (searchedcheckin.length > 0) {
                socket.emit('searchcheckinsuccess', searchedcheckin)
            } else {
                socket.emit('viewerror', `Checkin : ${searchcontact} not found `);
            }
        })
    } catch (error) {
        socket.emit('viewerror', 'Could not search please try again');
    }
}

const CheckInUpdate = (socket) => {
    try {
        socket.on("CheckInUpdate", async (data) => {
            // console.log(data)
            const updatedCheckin = await checkin.findOneAndUpdate(
                { $and: [{ floorNo: data.floorNo }, { roomNo: data.roomNo }] },
                {
                    $set: {
                        checkInDate: data.checkInDate,
                        checkOutDate: data.checkOutDate,
                        total: data.total,
                        balance: data.balance,
                        advance: data.advance,
                    }
                },
                { new: true }
            );

            if (updatedCheckin) {
                const updatedCheckin = await checkin.find({ status: "active" });
                socket.emit('updatecheckinsuccess', 'Checkin Updated successfully:', updatedCheckin);
            } else {
                // Emit an error message if the customer is not found or update fails
                socket.emit('viewerror', 'FloorNo with roomid not found or update failed');
            }
        })
    } catch (error) {
        socket.emit('viewerror', 'Could not update please try again');
    }
}

const CheckInDelete = (socket) => {
    try {
        socket.on('CheckInDelete', async (data) => {
            const deletedCheckin = await checkin.findOneAndDelete({ $and: [{ floorNo: data.floorNo }, { roomNo: data.roomNo }] });

            if (deletedCheckin) {
                const updateroom = await rooms.findOneAndUpdate(
                    { $and: [{ floor_no: data.floorNo }, { room_no: data.roomNo }] },
                    {
                        $set: {
                            status: "Available",
                        }
                    },
                    { new: true }
                );
                const remainingCheckin = await checkin.find({ status: "active" });

                socket.emit('updatecheckinsuccess', 'Checkin deleted successfully', remainingCheckin, true);
            } else {
                socket.emit('viewerror', 'Checkin not found or deletion failed');
            }
        })
    } catch (error) {
        socket.emit('viewerror', 'Could not delete please try again');
    }
}

module.exports = {
    checkinview,
    fetchroom,
    Bill,
    CheckIn,
    DisplayCheckin,
    SearchCheckin,
    CheckInUpdate,
    CheckInDelete
};