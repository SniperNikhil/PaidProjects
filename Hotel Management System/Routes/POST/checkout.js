const customers = require("../../model/customerSchema");
const rooms = require("../../model/roomsSchema")
const checkin = require("../../model/checkinSchema")
const oldcheckout = require("../../model/oldcheckoutSchema")

var L=[];

// Function to generate a random alphanumeric string of given length
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate an invoice number
function generateInvoiceNumber() {
    // Get current timestamp (milliseconds since Jan 1, 1970)
    const timestamp = Date.now();

    // Generate a random string of 5 characters
    const randomString = generateRandomString(5);

    // Concatenate timestamp and random string to create invoice number
    const invoiceNumber = `${timestamp}${randomString}`;

    return invoiceNumber;
}

const SearchCheckedin = (socket) =>{
    socket.on("searchcheckedin",async(data) =>{
        try {
            const searchcheckin = await checkin.findOne({$and : [{roomNo:data.searchroomno},{floorNo:data.searchfloorno},{status:"active"}]})
            const invoiceNumber = generateInvoiceNumber();
            L.push(invoiceNumber)
            if(searchcheckin){
                socket.emit("searchcheckedinsuccess",searchcheckin,invoiceNumber)
            }else{
                socket.emit("checkouterror",`Could not find room ${data.searchroomno} on floor no ${data.searchfloorno} ,or has been checkedout`)
            }
        } catch (error) {
            socket.emit("checkouterror","Could not Search,try again")
        }
    })
}

// Function to get today's date in a specified format
function getFormattedDate() {
    const today = new Date();

    const year = today.getFullYear(); // Get the current year (e.g., 2024)
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month (zero-indexed, so add 1)
    const day = today.getDate().toString().padStart(2, '0'); // Get the current day of the month

    // Format the date components into 'YYYY-MM-DD' format
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}
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

const CheckOut = (socket) =>{
    socket.on('Checkout',async(data) =>{
        try {
                  
            const updateroom = await rooms.findOneAndUpdate(
                { room_no: data.roomNo },
                { $set: {
                    status: "Available",
                }},
                { new: true }
            );
            const issuedate = getFormattedDate()
            const billnoofday = calculateNumberOfDays(data.checkInDate, data.checkOutDate)
            const UpdateStatus = await checkin.updateOne(
                {roomNo:data.roomNo},
                {$set:{
                    status:"inactive",
                    invoice:L[0],
                    issuedate:issuedate,
                    noofdays:billnoofday
                }}
            )
            data.issuedate=issuedate
            data.noofdays=billnoofday
            data.status="inactive"
            data.invoice=L[0]
            data.total=data.billtotalamount
            let newCheckin = new oldcheckout(data);
            const savedCheckin = await newCheckin.save();
            L=[]
            socket.emit("displaybill",data,issuedate,billnoofday)
        } catch (error) {
            console.log(error)
            socket.emit("checkouterror","Could not Checkout,try again")
        }
    })
}

const UpdateCheckoutrooms = (socket) =>{
    socket.on("UpdateCheckoutrooms",async() =>{
        try {
            const checkedinroom = await checkin.find({status:"active"}).select("roomNo")

            socket.emit("DropdownRoomSuccess",checkedinroom)
        } catch (error) {
            socket.emit("checkouterror","Could not Update Rooms Dropdown,Reload the page")
        }
    })
}
 
module.exports = {
    SearchCheckedin,
    CheckOut,
    UpdateCheckoutrooms
}