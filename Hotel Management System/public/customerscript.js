const socket = io()

const custid = document.getElementById('custid');
const gender = document.getElementById('gender');
const contact = document.getElementById('contact');
const cname = document.getElementById('name');
const dob = document.getElementById('dob');
const dor = document.getElementById('dor');
const email = document.getElementById('email');
const nationality = document.getElementById('nationality');
const profftype = document.getElementById('profftype');
const proofid = document.getElementById('proofid');
const address = document.getElementById('address');


// Function to collect customer data
function collectCustomerData() {
    const data = {
        custid: custid.value,
        gender: gender.value,
        contact: contact.value,
        name: cname.value,
        dob: dob.value,
        dor: dor.value,
        email: email.value,
        nationality: nationality.value,
        profftype: profftype.value,
        proofid: proofid.value,
        address: address.value
    };
    return data;
}

//----------------------------------------------------------------------------------
//Below code is for Adding the Rooms
const custsave = document.getElementById('custsave');
custsave.addEventListener('click', () => {
    if (
        custid.value !== "" &&
        gender.value !== "" &&
        contact.value !== "" &&
        cname.value !== "" &&
        dob.value !== "" &&
        dor.value !== "" &&
        email.value !== "" &&
        nationality.value !== "" &&
        profftype.value !== "Select" &&
        proofid.value !== "" &&
        address.value !== ""
    ) {
        const data = collectCustomerData();

        socket.emit('addcustomers', data);
    } else {
        // If any required field is empty, show alert
        alert("Please fill out all required fields.");
    }
});


// Function to populate customer table with data
function populateCustomerTable(customers, highlightedCustomerId) {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');

        // Populate row cells with customer data
        row.innerHTML = `
            <td>${customer.custid}</td>
            <td>${customer.gender}</td>
            <td>${customer.contact}</td>
            <td>${customer.name}</td>
            <td>${customer.dob}</td>
            <td>${customer.dor}</td>
            <td>${customer.email}</td>
            <td>${customer.nationality}</td>
            <td>${customer.profftype}</td>
            <td>${customer.proofid}</td>
            <td>${customer.address}</td>
        `;

        // Append row to table body
        tableBody.appendChild(row);

        // Reapply highlight to the previously highlighted row
        if (customer.custid == highlightedCustomerId) {
            row.classList.add("highlighted");
        }
    });

    setupCustomerRowClickListeners() // Reapply click event listeners to rows
}

// Event handler for 'addcustomersuccess' event
socket.on('addcustomersuccess', (message, addedCustomers) => {
    alert(message); // Display success message in an alert box
    populateCustomerTable(addedCustomers); // Populate customer table with updated data
});

// Event handler for 'addcustomererror' event
socket.on('addcustomererror', (message) => {
    alert(message); // Display error message in an alert box
});


// Get the "Clear" button element for customer details
const custclear = document.getElementById('custclear');
custclear.addEventListener('click', () => {
    socket.emit('displaycustomers');

    custid.disabled = false;
    custid.value = '';
    gender.value = 'male';
    contact.value = '';
    cname.value = '';
    dob.value = '';
    dor.value = '';
    email.value = '';
    nationality.value = '';
    profftype.value = 'Select';
    proofid.value = '';
    address.value = '';
    customersearch.value = 'Select';
    searchtext.value = '';

    // Remove highlight from all rows in customer table (if applicable)
    const rows = document.querySelectorAll("#customerTableBody tr");
    rows.forEach(row => {
        row.classList.remove("highlighted");
    });
});


// Function to add click event listener to each customer row
function setupCustomerRowClickListeners() {
    const rows = document.querySelectorAll("#customerTableBody tr");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            rows.forEach(r => r.classList.remove("highlighted"));

            // Add 'highlighted' class to the clicked row
            row.classList.add("highlighted");

            // Extract values from the clicked row
            const cells = row.cells; // Get all cells in the row
            const values = Array.from(cells).map(cell => cell.textContent); // Get text content of each cell

            // Set form fields with values from the clicked row
            custid.value = values[0];
            gender.value = values[1];
            contact.value = values[2]; 
            cname.value = values[3];
            dob.value = values[4];
            dor.value = values[5];
            email.value = values[6];
            nationality.value = values[7];
            profftype.value = values[8];
            proofid.value = values[9];
            address.value = values[10];
            
            // Disable certain form fields
            custid.disabled = true;
        });
    });
}
setupCustomerRowClickListeners();


//-----------------------------------------------------------------------------------
//BElow Code is For Updating the selected row
const custupdate = document.getElementById('custupdate');
custupdate.addEventListener('click', () => {
    if (
        custid.value !== "" &&
        gender.value !== "" &&
        contact.value !== "" &&
        cname.value !== "" &&
        dob.value !== "" &&
        dor.value !== "" &&
        email.value !== "" &&
        nationality.value !== "" &&
        profftype.value !== "Select" &&
        proofid.value !== "" &&
        address.value !== ""
    ) {
        const data = collectCustomerData();
        socket.emit('updaterooms', data);
    } else {
        alert("Please Select a Row from the table")
    }
})


// Event handler for 'updatecustomersuccess' event
socket.on('updatecustomersuccess', (message, updatedCustomers, clear) => {
    alert(message);

    if (clear) {
        custclear.click();
    }

    const highlightedRowId = document.querySelector("#customerTableBody tr.highlighted")?.cells[0]?.textContent;

    populateCustomerTable(updatedCustomers, highlightedRowId);
});


//---------------------------------------------------------------------------------------------
//BElow code is for Delete Button to delete a room
const custdelete = document.getElementById('custdelete');
custdelete.addEventListener('click', () => {
    if (
        custid.value !== "" &&
        gender.value !== "" &&
        contact.value !== "" &&
        cname.value !== "" &&
        dob.value !== "" &&
        dor.value !== "" &&
        email.value !== "" &&
        nationality.value !== "" &&
        profftype.value !== "Select" &&
        proofid.value !== "" &&
        address.value !== ""
    ) {
        const data = collectCustomerData();
        socket.emit('deletecustomer', data);
    } else {
        alert("Please Select a Row from the table")
    }
})

//---------------------------------------------------------------------------------------------
//Below Code is for Search Button
const searchbtn = document.getElementById("searchbtn")
const customersearch = document.getElementById('customersearch')
const searchtext = document.getElementById("searchtext")
searchbtn.addEventListener('click',()=>{
    if(customersearch.value != "Select" && searchtext.value != ""){
        const data = {
            searchtype:customersearch.value,
            searchtext:searchtext.value
        }
        socket.emit('searchcustomer',data)
    }else{
        alert("Please Select a list from the dropdown of search or Searched text cannot be empty ")
    }
})

socket.on('searchcustomersuccess',(data) =>{
    populateCustomerTable(data);
})
