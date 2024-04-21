const socket = io()

const searchfloorno = document.getElementById("searchfloorno")
const searchroomno = document.getElementById("searchroomno")
const invoice = document.getElementById('invoice');
const cname = document.getElementById('name');
const contact = document.getElementById('contact');
const roomNo = document.getElementById('roomno');
const checkInDate = document.getElementById('checkindate');
const checkOutDate = document.getElementById('checkoutdate');
const totalBill = document.getElementById('total');
const advance = document.getElementById('advance');
const balance = document.getElementById('balance');
const searchcheckin = document.getElementById("searchcheckin")
const checkoutButton = document.getElementById('checkoutbtn');
const clearButton = document.getElementById('clearbtn');
const printButton = document.getElementById('printbtn');

const billinvoice = document.getElementById('billinvoice');
const billissuedate = document.getElementById('billissuedate');
const billname = document.getElementById('billname');
const billcontact = document.getElementById('billcontact');
const billcheckindate = document.getElementById('billcheckindate');
const billcheckoutdate = document.getElementById('billcheckoutdate');
const billnoofdays = document.getElementById('billnoofdays');
const billroomno = document.getElementById('billroomno');
const billtotalamount = document.getElementById('billtotalamount')

invoice.disabled = true
cname.disabled = true
contact.disabled = true
roomNo.disabled = true
checkInDate.disabled = true
checkOutDate.disabled = true
totalBill.disabled = true
advance.disabled = true
balance.disabled = true


socket.on("checkouterror", (data) => {
    alert(data)
})

searchcheckin.addEventListener('click', () => {
    if (searchfloorno.value != "Select Floor No" && searchroomno.value != "Select Room No") {
        const data = {
            searchfloorno: searchfloorno.value,
            searchroomno: searchroomno.value
        }
        socket.emit("searchcheckedin", data)
    } else {
        alert("Please Select a Floor No and Room No")
    }
})

socket.on('searchcheckedinsuccess', (data, invoiceNumber) => {
    invoice.value = invoiceNumber
    cname.value = data.cname;
    contact.value = data.contact;
    roomNo.value = data.roomNo;
    checkInDate.value = data.checkInDate;
    checkOutDate.value = data.checkOutDate;
    totalBill.value = data.total;
    advance.value = data.advance;
    balance.value = data.balance;
})

checkoutButton.addEventListener('click', () => {
    if (
        invoice.value != "",
        cname.value != "",
        contact.value != "",
        roomNo.value != "",
        checkInDate.value != "",
        checkOutDate.value != "",
        totalBill.value != "",
        advance.value != "",
        balance.value != ""
    ) {
        if (confirm("Do you really want to checkout")) {           
            const data = {
                invoice: invoice.value,
                cname: cname.value,
                contact: contact.value,
                roomNo: roomNo.value,
                checkInDate: checkInDate.value,
                checkOutDate: checkOutDate.value,
                totalBill: totalBill.value,
                advance: advance.value,
                balance: balance.value,
                billtotalamount: totalBill.value
            }
            socket.emit('Checkout', data)
            socket.emit("UpdateCheckoutrooms")
        }
    } else {
        alert("Please Search the room detatils")
    }
})

function convertDateFormat(inputDate) {
    // Split the input date string into year, month, and day components
    const [year, month, day] = inputDate.split('-');

    // Construct a new Date object using the parsed components
    const dateObj = new Date(`${year}-${month}-${day}`);

    // Extract day, month, and year from the Date object
    const formattedDay = dateObj.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
    const formattedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Get month (adding 1 to zero-indexed month) and pad with leading zero if needed
    const formattedYear = dateObj.getFullYear(); // Get full year

    // Construct the formatted date string in 'DD-MM-YYYY' format
    const formattedDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;

    return formattedDate;
}

socket.on('displaybill', (data, issuedate, billnoofday) => {
    billinvoice.textContent = data.invoice
    billissuedate.textContent = issuedate
    billname.textContent = data.cname
    billcontact.textContent = data.contact
    billcheckindate.textContent = convertDateFormat(data.checkInDate)
    billcheckoutdate.textContent = convertDateFormat(data.checkOutDate)
    billnoofdays.textContent = billnoofday
    billroomno.textContent = data.roomNo
    billtotalamount.textContent = 'Rs.' + data.billtotalamount + '/-'
})

const printbill = document.getElementById('printbill')
printButton.addEventListener('click', () => {
    const printContent = document.getElementById('printbill').innerHTML;

    // Create a new window to hold the printable content
    const printWindow = window.open('', '_blank');

    // Write the HTML content to the new window
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Print Bill</title>
            <link rel="stylesheet" href="style.css">
            <style>
            @media print {
                body {
                    transform: scale(1.0); /* Adjust the scale value as needed */
                    
                }
                .checkoutbill{
                    transform: scale(1.3);
                }
            }
            </style>
        </head>
        <body>
            <div class="content1 c">
                <div class="checkoutsearched">
                    <div class="checkoutbill">
                        ${printContent}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);

    // Ensure styles are loaded before printing
    printWindow.document.close();

    // Wait for stylesheets to load
    printWindow.onload = () => {
        // Trigger printing
        printWindow.print();
        // Close the new window after printing
        printWindow.close();
    };
});


clearButton.addEventListener('click', () => {
    if (window.confirm("Dou you really want to clear")) {
        socket.emit("UpdateCheckoutrooms")
        searchfloorno.value = "Select Floor No"
        searchroomno.value = "Select Room No"

        invoice.value = "";
        cname.value = "";
        contact.value = "";
        roomNo.value = "";
        checkInDate.value = "";
        checkOutDate.value = "";
        totalBill.value = "";
        advance.value = "";
        balance.value = "";

        billinvoice.textContent = ""
        billissuedate.textContent = ""
        billname.textContent = ""
        billcontact.textContent = ""
        billcheckindate.textContent = ""
        billcheckoutdate.textContent = ""
        billnoofdays.textContent = ""
        billroomno.textContent = ""
        billtotalamount.textContent = 'Rs.'
    }
})

function populateRoomSelect(availableroom) {
    const selectElement = document.getElementById("searchroomno");

    // Clear existing options
    selectElement.innerHTML = '';

    // Add default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'Select Room No';
    defaultOption.textContent = 'Select Room No';
    selectElement.appendChild(defaultOption);

    // Loop through availableroom array and create options
    availableroom.forEach(room => {
        const option = document.createElement('option');
        option.value = room.roomNo; // Set the value to room_no
        option.textContent = `${room.roomNo}`;
        selectElement.appendChild(option);
    });
}
socket.on("DropdownRoomSuccess",(data) =>{
    populateRoomSelect(data)
})