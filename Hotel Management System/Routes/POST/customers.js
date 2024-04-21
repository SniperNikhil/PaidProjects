const customers = require("../../model/customerSchema")

// Function to handle adding a new room
const AddCustomer = (socket) => {
    socket.on('addcustomers', async (data) => {
        try {
            let newCustomer = new customers(data);

            const existingCustomer = await customers.findOne({ $or: [{ custid: data.custid }, { email: data.email }] });
            if (existingCustomer) {
                socket.emit('addcustomererror', `Customer with ID ${data.custid} or email ${data.email} already exists`);
                return;
            }

            const savedCustomer = await newCustomer.save();

            const allCustomers = await customers.find();

            socket.emit('addcustomersuccess', 'Customer added successfully', allCustomers);
        } catch (error) {
            console.error('Error adding customer:', error);
            socket.emit('addcustomererror', 'Error adding customer');
        }
    });
};

// Function to handle updating an existing customer
const UpdateCustomer = (socket) => {
    socket.on('updaterooms', async (data) => {
        try {
            // Find and update the customer based on customer ID (custid)
            const updatedCustomer = await customers.findOneAndUpdate(
                { custid: data.custid },
                { $set: {
                    gender: data.gender,
                    contact: data.contact,
                    name: data.name,
                    dob: data.dob,
                    dor: data.dor,
                    email: data.email,
                    nationality: data.nationality,
                    profftype: data.profftype,
                    proofid: data.proofid,
                    address: data.address
                }},
                { new: true }
            );

            if (updatedCustomer) {
                const updatedCustomers = await customers.find();
                socket.emit('updatecustomersuccess', 'Customer Updated successfully:', updatedCustomers);
            } else {
                // Emit an error message if the customer is not found or update fails
                socket.emit('addcustomererror', 'Customer not found or update failed');
            }
        } catch (error) {
            // Emit an error message if an error occurs during customer update
            socket.emit('addcustomererror', 'Error Updating customer');
        }
    });
}

// Function to handle deleting a customer
const DeleteCustomer = (socket) => {
    socket.on('deletecustomer', async (data) => {
        try {
            // console.log(data)
            const deletedCustomer = await customers.findOneAndDelete({ custid: data.custid });

            if (deletedCustomer) {
                const remainingCustomers = await customers.find();

                socket.emit('updatecustomersuccess', 'Customer deleted successfully', remainingCustomers, true);
            } else {
                socket.emit('addcustomererror', 'Customer not found or deletion failed');
            }
        } catch (error) {
            socket.emit('addcustomererror', 'Error deleting customer');
        }
    });
}

const SearchCustomer = (socket) =>{
    socket.on("searchcustomer",async(data) =>{
        try {
            const value = (data.searchtype).toLowerCase()

            const searchedcustomer = await customers.find({[value]:data.searchtext})

            if(searchedcustomer.length > 0){
                socket.emit("searchcustomersuccess",searchedcustomer)
            }else{
                socket.emit('addcustomererror', 'Customer does not exist');
            }
        } catch (error) {
            console.log(error)
            socket.emit('addcustomererror', 'Error Searching customer');
        }
    })
}

// Function to handle displaying all rooms
const DisplayCustomers = (socket) => {
    socket.on('displaycustomers', async () => {
        try {
            // Retrieve all rooms from the database
            const displaycustomers = await customers.find()

            // Emit the list of rooms to clients
            socket.emit('searchcustomersuccess', displaycustomers)
        } catch (error) {
            // Emit an error message if an error occurs during room retrieval
            socket.emit('addcustomererror', 'Could not clear Customer table please refresh');
        }
    })
}

module.exports = {AddCustomer,UpdateCustomer,DeleteCustomer,SearchCustomer,DisplayCustomers}