const socket = io()

//-----------------------------------------------------------------------------------------
//Below Code is  to get all the id elements
const checkinselect = document.getElementById("checkinselect")
const cidormob = document.getElementById('cidormob')
const cname = document.getElementById('cname');
const contact = document.getElementById('contact');
const category = document.getElementById('category');
const floorNo = document.getElementById('floorno');
const checkInDate = document.getElementById('checkindate');
const checkOutDate = document.getElementById('checkoutdate');
const roomNo = document.getElementById('roomno');
const price = document.getElementById('price');
const total = document.getElementById('total');
const advance = document.getElementById('adavance');
const balance = document.getElementById('balance');
const billButton = document.getElementById('billbtn');
const checkInButton = document.getElementById('checkinbtn');
const clearButton = document.getElementById('clearbtn');
const checkinupdate = document.getElementById("checkinupdate")
const checkindelete = document.getElementById("checkindelete")


//-----------------------------------------------------------------------------------------
//Below Code is to Disable some elements so that it cannot be changed
cname.disabled = true
contact.disabled = true
category.disabled = true
floorNo.disabled = true
roomNo.disabled = true
price.disabled = true
total.disabled = true
balance.disabled = true


//-----------------------------------------------------------------------------------------
//Below Code is to fetch the registered customer details using cust id or phone number
const view = document.getElementById('view')
view.addEventListener('click', () => {
    socket.emit("viewcustomer", cidormob.value)
})

//-----------------------------------------------------------------------------------------
//Below code is to display the fetched customer details 
socket.on("displayview", (data) => {
    cname.value = data.name
    contact.value = data.contact
})


//-----------------------------------------------------------------------------------------
//Below code is to display error message if any error occured during checkin
socket.on("viewerror", (data) => {
    alert(data)
})


//-----------------------------------------------------------------------------------------
//Below Code is to fetch the available room details using room id
const fetchroom = document.getElementById("fetchroom")
fetchroom.addEventListener('click', () => {
    if (checkinselect.value != "Select") {
        socket.emit("fetchroomdata", checkinselect.value)
    } else {
        alert("Please Select the Room id from dropdown")
    }
})


//-----------------------------------------------------------------------------------------
//Below code is to display the fetched room details 
socket.on("displayfetchroom", (data) => {
    category.value = data.category
    floorNo.value = data.floor_no
    roomNo.value = data.room_no
    price.value = data.price
})


//-----------------------------------------------------------------------------------------
//Below code is to Calculate the total and balance using the date and price and advance
billButton.addEventListener('click', () => {
    checkinupdate.disabled = false
    checkinupdate.textContent = "Update"
    if (cname.value && contact.value && floorNo.value && checkInDate.value != "" && checkOutDate.value != "" && roomNo.value && price.value) {
        const data = {
            checkInDate: checkInDate.value,
            checkOutDate: checkOutDate.value,
            price: price.value,
            advance: advance.value
        }
        socket.emit("Bill", data)
    } else {
        alert("Please Enter All Required Fields");
    }
})


//-----------------------------------------------------------------------------------------
//Below Code is to display the calculated total amount and balance
socket.on("totalbalance", (data) => {
    total.value = data.total
    balance.value = data.balance
})


//-----------------------------------------------------------------------------------------
//Below Code is to Clear all id elements (Reset to default)
clearButton.addEventListener('click', () => {
    socket.emit('displaycheckin')

    checkinselect.value = "Select"
    cname.value = "";
    contact.value = "";
    category.value = "";
    floorNo.value = "";
    checkInDate.value = "";
    checkOutDate.value = "";
    roomNo.value = "";
    price.value = "";
    total.value = "";
    advance.value = "0";
    balance.value = "";
    cidormob.value = "";
    searchcontact.value = "";

    checkinupdate.disabled = false
    checkinupdate.textContent = "Update"

    // Remove highlight from all rows in customer table (if applicable)
    const rows = document.querySelectorAll("#checkinTableBody tr");
    rows.forEach(row => {
        row.classList.remove("highlighted");
    });
})


//-----------------------------------------------------------------------------------------
//Below Code is for Checkin Button 
checkInButton.addEventListener('click', () => {
    if (
        cname.value != "" &&
        contact.value != "" &&
        category.value != "" &&
        floorNo.value != "" &&
        checkInDate.value != "" &&
        checkOutDate.value != "" &&
        roomNo.value != "" &&
        price.value != "" &&
        total.value != "" &&
        balance.value != ""
    ) {
        const data = {
            cname: cname.value,
            contact: contact.value,
            category: category.value,
            floorNo: floorNo.value,
            checkInDate: checkInDate.value,
            checkOutDate: checkOutDate.value,
            roomNo: roomNo.value,
            price: price.value,
            total: total.value,
            balance: balance.value,
            advance: advance.value
        }
        socket.emit("CheckInData", data)
    } else {
        alert("Please Enter All Required Fields")
    }
})


//-----------------------------------------------------------------------------------------
// Function to add click event listener to each checkin row
function setupCheckinRowClickListeners() {
    const rows = document.querySelectorAll("#checkinTableBody tr");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            rows.forEach(r => r.classList.remove("highlighted"));

            // Add 'highlighted' class to the clicked row
            row.classList.add("highlighted");

            // Extract values from the clicked row
            const cells = row.cells; // Get all cells in the row
            const values = Array.from(cells).map(cell => cell.textContent); // Get text content of each cell

            // Set form fields with values from the clicked row
            cname.value = values[1];
            contact.value = values[2];
            checkInDate.value = values[3];
            checkOutDate.value = values[4];
            category.value = values[5];
            floorNo.value = values[6];
            roomNo.value = values[7];
            price.value = values[8];
            total.value = values[9];
            advance.value = values[10];
            balance.value = values[11];
            checkinupdate.disabled = true
            checkinupdate.textContent = "Click on Bill first"
        });
    });
}
setupCheckinRowClickListeners();


//-----------------------------------------------------------------------------------------
// Function to populate checkin table with data
function populateCheckinTable(checkin, highlightedRowId) {
    const tableBody = document.getElementById('checkinTableBody');
    tableBody.innerHTML = '';

    checkin.forEach(checkins => {
        const row = document.createElement('tr');

        // Populate row cells with customer data
        row.innerHTML = `
            <td>${checkins.checkinid}</td>
            <td>${checkins.cname}</td>
            <td>${checkins.contact}</td>
            <td>${checkins.checkInDate}</td>
            <td>${checkins.checkOutDate}</td>
            <td>${checkins.category}</td>
            <td>${checkins.floorNo}</td>
            <td>${checkins.roomNo}</td>
            <td>${checkins.price}</td>
            <td>${checkins.total}</td>
            <td>${checkins.advance}</td>
            <td>${checkins.balance}</td>
            <td>${checkins.status}</td>
        `;

        // Append row to table body
        tableBody.appendChild(row);

        // Reapply highlight to the previously highlighted row
        if (checkins.checkinid == highlightedRowId) {
            console.log(checkins.checkinid, highlightedRowId)
            row.classList.add("highlighted");
        }
    });


    setupCheckinRowClickListeners() // Reapply click event listeners to rows
}


//-----------------------------------------------------------------------------------------
// Function to Update available rooms dropdown on successfull checkin
function populateRoomSelect(availableroom) {
    const selectElement = document.getElementById("checkinselect");

    // Clear existing options
    selectElement.innerHTML = '';

    // Add default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'Select';
    defaultOption.textContent = 'Select';
    selectElement.appendChild(defaultOption);

    // Loop through availableroom array and create options
    availableroom.forEach(room => {
        const option = document.createElement('option');
        option.value = room.room_no; // Set the value to room_no
        option.textContent = `${room.room_no} (${room.category})`;
        selectElement.appendChild(option);
    });
}


//-----------------------------------------------------------------------------------------
// Event handler for 'addcheckinsuccess' event
socket.on('addcheckinsuccess', (message, allCheckin, roomdata) => {
    alert(message); // Display success message in an alert box
    populateRoomSelect(roomdata);
    populateCheckinTable(allCheckin); // Populate customer table with updated data
});


//-----------------------------------------------------------------------------------------
// Below code is for display data default data on click of clear button , or to display searched data
socket.on('searchcheckinsuccess', (data, data1) => {
    populateCheckinTable(data);
    populateRoomSelect(data1)
})


//-----------------------------------------------------------------------------------------
// Below code is for Searching and fetching data for the table 
const searchbtn = document.getElementById("searchbtn");
const searchcontact = document.getElementById("searchcontact")
searchbtn.addEventListener('click', () => {
    console.log(searchcontact.value)
    if (searchcontact.value != "") {
        socket.emit("searchcheckinvalue", searchcontact.value)
    } else {
        alert("Search Text Cannnot be Empty")
    }
})


//-----------------------------------------------------------------------------------------
// Below code is for Updating the saved checkin data
checkinupdate.addEventListener('click', () => {
    if (
        cname.value != "" &&
        contact.value != "" &&
        category.value != "" &&
        floorNo.value != "" &&
        checkInDate.value != "" &&
        checkOutDate.value != "" &&
        roomNo.value != "" &&
        price.value != "" &&
        total.value != "" &&
        balance.value != ""
    ) {
        const data = {
            floorNo: floorNo.value,
            checkInDate: checkInDate.value,
            checkOutDate: checkOutDate.value,
            roomNo: roomNo.value,
            total: total.value,
            balance: balance.value,
            advance: advance.value
        }
        socket.emit("CheckInUpdate", data)
    } else {
        alert("Please Enter All Required Fields")
    }
})


socket.on('updatecheckinsuccess', (message, updatedCheckin, clear) => {
    alert(message);

    if (clear) {
        clearButton.click();
    }

    const highlightedRowId = document.querySelector("#checkinTableBody tr.highlighted")?.cells[0]?.textContent;

    populateCheckinTable(updatedCheckin, highlightedRowId);
})


checkindelete.addEventListener('click', () => {
    if (
        cname.value != "" &&
        contact.value != "" &&
        category.value != "" &&
        floorNo.value != "" &&
        checkInDate.value != "" &&
        checkOutDate.value != "" &&
        roomNo.value != "" &&
        price.value != "" &&
        total.value != "" &&
        balance.value != ""
    ) {
        const data = {
            floorNo: floorNo.value,
            roomNo: roomNo.value,
        }
        socket.emit("CheckInDelete", data)
    } else {
        alert("Please Enter All Required Fields")
    }
})