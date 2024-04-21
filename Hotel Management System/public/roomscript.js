const socket = io();

const roomcategory = document.getElementById('roomcategory');
const roomfloorno = document.getElementById('roomfloorno');
const roomroomno = document.getElementById('roomroomno');
const roomprice = document.getElementById('roomprice');
const roomstatus = document.getElementById('roomstatus');

function collectdata(){
    const data = {
        category: roomcategory.value,
        floor_no: roomfloorno.value,
        room_no: roomroomno.value,
        price: roomprice.value,
        status: roomstatus.value
    };
    return data;
}

//----------------------------------------------------------------------------------
//Below code is for Adding the Rooms
var addroom = document.getElementById("roomsave");
addroom.addEventListener('click', () => {
    if (roomcategory.value != "Select" && roomfloorno.value != "" && roomroomno.value != "" && roomprice.value != "") {
        const data = collectdata()
        socket.emit('addrooms', data);
    } else {
        alert("Please Select All Values")
    }
});


//---------------------------------------------------------------------------------
// Function to populate room table with data
function populateRoomTable(rooms, highlightedRowId) {
    const tableBody = document.getElementById('roomTableBody');
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const row = document.createElement('tr');

        // Populate row cells with room data
        row.innerHTML = `
            <td>${room.roomid}</td>
            <td>${room.category}</td>
            <td>${room.floor_no}</td>
            <td>${room.room_no}</td>
            <td>${room.price}</td>
            <td>${room.status}</td>
        `;

        // Append row to table body
        tableBody.appendChild(row);

        // Reapply highlight to the previously highlighted row
        if (room.roomid == highlightedRowId) {
            row.classList.add("highlighted");
        }
    });

    setupRowClickListeners(); // Reapply click event listeners to rows
}


//---------------------------------------------------------------------------------
//Below Code is for Showing Success Message on adding room and display in tabel
socket.on('addroomsuccess', (message, addedRooms) => {
    alert(message);
    populateRoomTable(addedRooms);
});


//----------------------------------------------------------------------------------
//BElow Code is For Some Validation for Rooms like 
//There cannot be same room no in one floor
socket.on('addroomerror', (message) => {
    alert(message)
});


//----------------------------------------------------------------------------------
//Below code is for Clear Button in the Rooms
var roomclear = document.getElementById("roomclear");
roomclear.addEventListener('click', () => {
    socket.emit('displayrooms')
    roomfloorno.disabled = false;
    roomroomno.disabled = false;
    searchroom.value='';
    const rows = document.querySelectorAll("#roomTableBody tr");
    rows.forEach(row => {
        row.classList.remove("highlighted");
    });
    roomcategory.value = 'Select';
    roomfloorno.value = '';
    roomroomno.value = '';
    roomprice.value = '';
    roomstatus.value = 'Available';
})


//-----------------------------------------------------------------------------------
//Making Sure that input accepts only numbers
function validateNumber(input) {
    input.value = input.value.replace(/[^0-9]/g, '')
}


//-----------------------------------------------------------------------------------
//Below Code is for Rooms table values when clicked the values should be displayed  in manage rooms details
// Add click event listener to each row
function setupRowClickListeners() {
    const rows = document.querySelectorAll("#roomTableBody tr");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            rows.forEach(r => r.classList.remove("highlighted"));

            // Add 'highlighted' class to the clicked row
            row.classList.add("highlighted");

            // Extract values from the clicked row
            const cells = row.cells; // Get all cells in the row
            const values = Array.from(cells).map(cell => cell.textContent); // Get text content of each cell

            roomcategory.value = values[1];
            roomfloorno.value = values[2];
            roomroomno.value = values[3];
            roomprice.value = values[4];
            roomstatus.value = values[5];

            roomfloorno.disabled = true;
            roomroomno.disabled = true;
        });
    });
}
setupRowClickListeners();


//-----------------------------------------------------------------------------------
//BElow Code is For Updating the selected row
var updateroom = document.getElementById("roomupdate");
updateroom.addEventListener('click', () => {
    if (roomcategory.value != "Select" && roomfloorno.value != "" && roomroomno.value != "" && roomprice.value != "") {
        const data = collectdata();
        socket.emit('updaterooms', data);
    } else {
        alert("Please Select a Row from the table")
    }
})


//---------------------------------------------------------------------------------------------
//Below Code is for Showing Success Message on adding room and display in tabel
socket.on('updateroomsuccess', (message, updatedRooms,clear) => {
    alert(message);
    if(clear){
        roomclear.click()
    }
    const highlightedRowId = document.querySelector("#roomTableBody tr.highlighted")?.cells[0]?.textContent;
    populateRoomTable(updatedRooms, highlightedRowId);
});


//---------------------------------------------------------------------------------------------
//BElow code is for Delete Button to delete a room
roomdelete.addEventListener('click',()=>{
    if (roomcategory.value != "Select" && roomfloorno.value != "" && roomroomno.value != "" && roomprice.value != "") {
        const data = collectdata();
        socket.emit('deleterooms', data);
    } else {
        alert("Please Select a Row from the table")
    }
})


//---------------------------------------------------------------------------------------------
//Below Code id for Searching and displaying the searched room
const searchroombtn = document.getElementById("searchroombtn")
const searchroom =document.getElementById("searchroom") 
searchroombtn.addEventListener('click',()=>{
    if(searchroom.value != ""){
        socket.emit('searchroomvalue',searchroom.value)
    }else{
        alert('Please Enter the room number you want to search')
    }
})

socket.on('searchroomsuccess',(data) =>{
    populateRoomTable(data);
})


//---------------------------------------------------------------------------------------------
//Below Code is to Display the rooms in table when clicked on clear
socket.on('displayroom',(data) =>{
    populateRoomTable(data);
})


//---------------------------------------------------------------------------------------------