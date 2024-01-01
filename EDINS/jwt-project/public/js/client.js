const socket = io();
var users_list = document.querySelector(".users-list");

var username = decodeURIComponent(document.cookie);
var username = username.match(/"([^']+)"/)[1];
// It will bw called when user joined
socket.emit("new-user-joined", username);

//Admin List
socket.on('user-list', (users) => {
    console.log(users);
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    const myCookie = getCookie('zemail');
    console.log(myCookie)
    for (i = 0; i < users_arr.length; i++) {
        if (users_arr[i].email != myCookie) {
            let p = document.createElement('button');
            // p.innerText = users_arr[i].first_name + " " + users_arr[i].last_name;
            p.innerText = users_arr[i].email;
            p.setAttribute("class", "my-button");
            document.getElementById("add_to_me").innerHTML +=
                "<hr>";
            users_list.appendChild(p);
        }
    }
    var buttons = document.getElementsByClassName("my-button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }
});

//Staff List
var users_list1 = document.querySelector(".users-list1");
socket.on('user-list1', (users) => {
    console.log(users);
    users_list1.innerHTML = "";
    users_arr = Object.values(users);
    const myCookie = getCookie('zemail');
    for (i = 0; i < users_arr.length; i++) {
        if (users_arr[i].email != myCookie) {
            let p = document.createElement('button');
            //p.innerText = users_arr[i].first_name + " " + users_arr[i].last_name;
            p.innerText = users_arr[i].email;
            p.setAttribute("class", "my-button");
            document.getElementById("add_to_me1").innerHTML +=
                "<hr>";
            users_list1.appendChild(p);
        }
    }
    var buttons = document.getElementsByClassName("my-button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }
})

//Student List
var users_list2 = document.querySelector(".users-list2");
socket.on('user-list2', (users) => {
    console.log(users);
    users_list2.innerHTML = "";
    users_arr = Object.values(users);
    const myCookie = getCookie('zemail');
    for (i = 0; i < users_arr.length; i++) {
        if (users_arr[i].email != myCookie) {
            let p = document.createElement('button');
            //p.innerText = users_arr[i].first_name + " " + users_arr[i].last_name;
            p.innerText = users_arr[i].email;
            p.setAttribute("class", "my-button");
            document.getElementById("add_to_me2").innerHTML +=
                "<hr>";
            users_list2.appendChild(p);
        }
    }
    var buttons = document.getElementsByClassName("my-button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }
})
// Click event handler
function handleClick(event) {
    // Get the innerText of the clicked button
    var buttonText = event.target.innerText;
    console.log(buttonText);
    var clientcookie = decodeURIComponent(document.cookie);
    var clientcookie = clientcookie.match(/"([^']+)"/)[1];
    var buttonText11 = {
        buttonText,
        clientcookie
    }
    socket.emit('clickedusername', buttonText11);
}

socket.on('uname', (un) => {
    clickedUser(un);
});

function clickedUser(un) {
    var ccookie = decodeURIComponent(document.cookie);
    var ccookie = ccookie.match(/"([^']+)"/)[1];
    if (un.client == ccookie) {
        document.getElementById("userImage").style.display = "";

        var userInput = document.querySelector('.user-input');
        userInput.style.display = '';

        var a = document.getElementById("clickedUser");
        a.innerText = un.uname;
        var inputField = document.getElementById("myInput");
        inputField.value = un.uid;

        // Get a reference to the button element
        var button = document.querySelector("#threedotbutton button");
        // Change the visibility to "hidden"
        button.style.visibility = "hidden";

        // Function to update the image source
        function updateImage(clickedimge) {
            // Check if clickedimge is empty or undefined
            if (clickedimge) {
                var imageSrc = "backend/images/" + clickedimge;
                // Temporarily assign an empty string to the onerror property to suppress the error
                imageElement.onerror = "";
                // Set the src attribute of the image element to the clickedimge URL
                imageElement.src = imageSrc;
            } else {
                // If clickedimge is empty or undefined, use a fallback image
                imageElement.src = "backend/images/7.jpg";
            }
        }

        // Get the image element
        var imageElement = document.getElementById('userImage');

        // Check if the image element exists
        if (imageElement) {
            // Example usage
            var clickedimge = un.clickedimge;
            updateImage(clickedimge);
        }

        deleteContent();

        function deleteContent() {
            var chatsDiv = document.querySelector('.chats');
            chatsDiv.innerHTML = '';
        }

        var senderid = decodeURIComponent(document.cookie);
        var senderid = senderid.match(/"([^']+)"/)[1];
        var inputField = document.getElementById("myInput");
        var receiverid = inputField.value;
        var data = {
            senderid,
            receiverid,
            ccookie
        };
        socket.emit('previousmessages', data);
    }
}

socket.on('previousdata', (projectedMessages) => {
    var clientcook = decodeURIComponent(document.cookie);
    var clientcook = clientcook.match(/"([^']+)"/)[1];
    for (let i = 0; i < projectedMessages.length; i++) {
        const fromSelf = projectedMessages[i].fromSelf;
        var data = {
            msg: projectedMessages[i].message,
        }
        console.log(projectedMessages[i].ccookie)
        if (fromSelf == true) {
            if (clientcook == projectedMessages[i].ccookie) {
                appendMessage11(data, 'outgoing');
            }
        } else if (fromSelf == false) {
            if (clientcook == projectedMessages[i].ccookie) {
                appendMessage11(data, 'incoming');
            }
        }
    }
})
function appendMessage11(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = '';

    if (data.senderemail !== undefined) {
        content += `<h6 style="color:yellow">${data.senderemail}</h6>`;
    }

    if (data.msg !== undefined) {
        content += `<p>${data.msg}</p>`;
    }

    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}
//Message
var user_msg = document.querySelector("#user-msg");
var msg_send = document.querySelector("#user-send");
var chats = document.querySelector(".chats");

msg_send.addEventListener('click', () => {
    var inputField = document.getElementById("myInput");
    var senderid = decodeURIComponent(document.cookie);
    var senderid = senderid.match(/"([^']+)"/)[1];
    if (inputField.value != "") {
        //console.log(user_msg.value);
        var senderemail = getCookie("zemail");
        let data = {
            msg: user_msg.value,
            receiverid: inputField.value,
            senderid: senderid,
            senderemail
        };
        let data1 = {
            msg: user_msg.value,
            receiverid: inputField.value,
            senderid: senderid,
        };
        if (user_msg.value != '') {
            appendMessage(data1, 'outgoing');
            socket.emit('message', data);
            user_msg.value = '';
        }
    } else {
        alert("Please Select a User from sidebar")
    }
});

function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = '';
    console.log(status);
    if (data.senderemail !== undefined) {
        content += `<h6 style="color:yellow">${data.senderemail}</h6>`;
    }

    if (data.msg !== undefined) {
        content += `<p>${data.msg}</p>`;
    }
    if (status == 'incoming') {
        const audio = new Audio('/Notification/whistle.mp3');
        audio.play();
    }
    if (status == 'outgoing') {
        const audio = new Audio('/Notification/notification.mp3');
        audio.play();
    }
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}


socket.on('message', (data) => {
    console.log("Message sent by group")
    console.log(data)
    var clientcook = decodeURIComponent(document.cookie);
    var clientcook = clientcook.match(/"([^']+)"/)[1];
    var inputField = document.getElementById("myInput");
    console.log(data.groupName)

    if (clientcook == data.receiverid && inputField.value == data.senderid) {
        appendMessage(data, 'incoming');
    }
});

function getCookie(name) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        // Check if the cookie starts with the desired name
        if (cookie.startsWith(name + '=')) {
            // Get the value of the cookie
            const cookieValue = cookie.substring(name.length + 1);

            // Decode and return the cookie value
            return decodeURIComponent(cookieValue);
        }
    }

    // Cookie not found
    return null;
}

//Group Chat
var creategroup = document.querySelector("#creategroup");

creategroup.addEventListener('click', () => {
    document.getElementById("userImage").style.display = "none";

    var a = document.getElementById("clickedUser");
    a.innerText = "Create Group";
    var inputField = document.getElementById("myInput");
    inputField.value = "";

    // Get a reference to the button element
    var button = document.querySelector("#threedotbutton button");
    // Change the visibility to "hidden";
    if (button) {
        button.style.visibility = "hidden";
    }

    createGroup()
    socket.emit('users');
});

function createGroup() {
    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }

    var userInput = document.querySelector('.user-input');
    userInput.style.display = 'none';

    let div = document.createElement('div');
    let content = `       
      <div id="groupname">Enter Group Name:   <input type="text" id="groupNameInput"> &nbsp&nbsp 
      <button onclick="submitGroup()" class="btn btn-primary btn1" id="creategroup">Create Group</button>
      <br><br>
      Add Participants:<br><br></div>
      <div id="userList"></div>     
    `;

    // Fetch users from the backend using sockets
    const socket = io();

    socket.on('allusers', (users) => {
        const userList = document.getElementById('userList');

        // Clear existing user list
        userList.innerHTML = '';

        users.forEach((user) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'participants';
            checkbox.value = user;
            checkbox.id = user;

            const label = document.createElement('label');
            label.textContent = user;
            label.setAttribute('for', user);

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);

            userList.appendChild(div);
        });
    });

    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

function submitGroup() {

    const groupNameInput = document.getElementById('groupNameInput');
    const groupName = groupNameInput.value;

    const checkboxes = document.getElementsByName('participants');
    const selectedUsers = [];
    if (groupName == "") {
        alert("Please add group name");
    } else {
        // Loop through all checkboxes to find the selected ones

        let isAnyCheckboxSelected = false;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedUsers.push(checkbox.value);
                isAnyCheckboxSelected = true;
            }
        });

        if (!isAnyCheckboxSelected) {
            alert("Please select users from Add Participants");
        } else {
            console.log(selectedUsers);

            // Send the selectedUsers array to the backend using sockets or HTTP request
            // Example using socket.io
            const socket = io();
            var clientcookie = decodeURIComponent(document.cookie);
            var clientcookie = clientcookie.match(/"([^']+)"/)[1];
            socket.emit('createGroup', { groupName, users: selectedUsers, clientcookie })
        }
    }
}

socket.on('SuccessGroup', (a) => {
    var clientcookie = decodeURIComponent(document.cookie);
    var clientcookie = clientcookie.match(/"([^']+)"/)[1];
    if (clientcookie == a.client) {
        deleteContent();

        function deleteContent() {
            var chatsDiv = document.querySelector('.chats');
            chatsDiv.innerHTML = '';
        }

        let div = document.createElement('div');
        let content = `       
        <p>${a.a}</p>
    `;
        div.innerHTML = content;
        chats.appendChild(div);
        chats.scrollTop = chats.scrollHeight;
    }
});

//Chat Group List
var group_list = document.querySelector(".group-list");
socket.on('group-list', (users) => {
    //console.log(users);
    group_list.innerHTML = "";
    users_arr = Object.values(users);
    var currentuser = getCookie("zemail")

    for (i = 0; i < users_arr.length; i++) {
        const usersArray = users_arr[i].users;
        //console.log(`Users: ${usersArray.join(', ')}`);

        for (let j = 0; j < usersArray.length; j++) {
            const user = usersArray[j];
            if (user == currentuser) {
                let p = document.createElement('button');
                //p.innerText = users_arr[i].first_name + " " + users_arr[i].last_name;
                p.innerText = users_arr[i].groupname;
                p.setAttribute("class", "my-button");
                document.getElementById("add_to_me3").innerHTML +=
                    "<hr>";
                group_list.appendChild(p);
            }
        }
    }
    var buttons = document.getElementsByClassName("my-button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClickGroup);
    }
})

function handleClickGroup(event) {
    // Get the innerText of the clicked button
    var groupbuttonText = event.target.innerText;
    //console.log(groupbuttonText);
    // socket.emit('clickedusername', groupbuttonText);
    var clientcookie = decodeURIComponent(document.cookie);
    var clientcookie = clientcookie.match(/"([^']+)"/)[1];
    var groupbuttonText1 = {
        clientcookie,
        groupbuttonText
    }

    // Create a new button element
    var button = document.createElement("button");

    // Set the button's text content
    button.textContent = "⋮";

    // Get a reference to the div element
    var div = document.getElementById("threedotbutton");

    button.style.visibility = "visible";

    // Append the button to the div
    div.innerHTML = "";
    div.appendChild(button);

    socket.emit('clickedgroupname', groupbuttonText1);
}

socket.on('clickedgrouptext', (data) => {
    var clientcookie = decodeURIComponent(document.cookie);
    var clientcookie = clientcookie.match(/"([^']+)"/)[1];

    if (clientcookie == data.client) {
        document.getElementById("userImage").style.display = "none";

        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';

        var a = document.getElementById("clickedUser");
        a.innerText = data.groupbuttonText;

        var inputField = document.getElementById("myInput");
        inputField.value = data.groupbuttonText;

        var userInput = document.querySelector('.user-input');
        userInput.style.display = '';

        var senderid = decodeURIComponent(document.cookie);
        var senderid = senderid.match(/"([^']+)"/)[1];
        var inputField = document.getElementById("myInput");
        var receiverid = inputField.value;
        var ccookie = decodeURIComponent(document.cookie);
        var ccookie = ccookie.match(/"([^']+)"/)[1];
        var groupbuttonText = data.groupbuttonText;
        var data = {
            senderid,
            receiverid,
            ccookie,
            groupbuttonText
        };

        socket.emit('previousgroupmessages', data);
    }
});

socket.on('gpmessage', (data) => {
    console.log("Message sent by group");
    console.log(data);
    var clientcook = decodeURIComponent(document.cookie);
    var clientcook = clientcook.match(/"([^']+)"/)[1];
    var inputField = document.getElementById("myInput");
    console.log(data.groupName);
    var chatsDiv = document.querySelector('.chats');
    if (inputField.value == data.groupName && clientcook != data.senderid) {
        if (chatsDiv.innerHTML.includes(`<h2>Members of ${data.receiverid} :-</h2>`)) {
            console.log("Working")
        } else if (chatsDiv.innerHTML.includes('<h2>Add Members :-</h2>')) {
            console.log("Working")
        } else if (chatsDiv.innerHTML.includes('<h2>Remove Members :-</h2>')) {
            console.log("Working")
        } else {
            appendMessage(data, 'incoming');
        }
    }
});

socket.on('previousgroupdata', (projectedMessages) => {
    var clientcook = decodeURIComponent(document.cookie);
    var clientcook = clientcook.match(/"([^']+)"/)[1];
    for (let i = 0; i < projectedMessages.length; i++) {
        const fromSelf = projectedMessages[i].fromSelf;
        var data = {
            msg: projectedMessages[i].message,
            senderemail: projectedMessages[i].senderemail
        }
        var data1 = {
            msg: projectedMessages[i].message,
        }
        console.log(projectedMessages[i].ccookie)
        if (fromSelf == true) {
            if (clientcook == projectedMessages[i].ccookie) {
                appendMessage11(data1, 'outgoing');
            }
        } else if (fromSelf == false) {
            if (clientcook == projectedMessages[i].ccookie) {
                appendMessage11(data, 'incoming');
            }
        }
    }
})

//Three dot  With Dropdown
var threedot = document.querySelector("#threedotbutton");
var dropdownMenu = document.querySelector("#dropdown-menu");

threedot.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
    adjustDropdownPosition();
});

document.addEventListener("click", function () {
    dropdownMenu.classList.remove("show");
    dropdownMenu.classList.remove("right");
});

function adjustDropdownPosition() {
    const dropdownRect = dropdownMenu.getBoundingClientRect();
    const isOverflowing = dropdownRect.right > window.innerWidth;
    dropdownMenu.classList.toggle("right", isOverflowing);
}

window.addEventListener("resize", function () {
    if (dropdownMenu.classList.contains("show")) {
        adjustDropdownPosition();
    }
});

//Three dot dropdown code
var viewmembers = document.querySelector("#viewmembers");
var addmembers = document.querySelector("#addmembers");
var removemembers = document.querySelector("#removemembers");
var deletegroup = document.querySelector("#deletegroup");
var exitgroup = document.querySelector("#exitgroup");

//View Group Members below code
viewmembers.addEventListener('click', () => {   
    console.log("View Members");
    var inputField = document.getElementById("myInput").value;
    socket.emit('viewgroupmembers', inputField);
});
socket.on('viewgroupmembers', (data) => {
    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }
    var userInput = document.querySelector('.user-input');
    userInput.style.display = 'none';


    const chatsDiv = document.querySelector('.chats');
    const chatItem1 = document.createElement('h2');
    chatItem1.textContent = `Members of ${data.data} :-`;
    chatsDiv.appendChild(chatItem1);
    const hr = document.createElement('hr');
    chatsDiv.appendChild(hr);
    var i = 1;
    for (const user of data.usersArray) {
        const chatItem = document.createElement('p');
        chatItem.textContent = `${i}) ${user}`;
        chatsDiv.appendChild(chatItem);
        i++;
    }
})


//ADD New Group Members below code
addmembers.addEventListener('click', () => {
    console.log("addmembers");
    var inputField = document.getElementById("myInput").value;

    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }
    var userInput = document.querySelector('.user-input');
    userInput.style.display = 'none';

    let div = document.createElement('div');
    let content = `
    <div style="display:flex;">   
        <h2>Add Members :-</h2> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   
      <button onclick="addmembersfunction()" class="btn btn-primary btn1" id="creategroup">Add Members</button>
      </div>  <hr>   
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    var ccookie = decodeURIComponent(document.cookie);
    var ccookie = ccookie.match(/"([^']+)"/)[1];
    var data = { ccookie, inputField }
    socket.emit('users', (data));
});

socket.on('allgroupusers', (data) => {
    console.log(data);
    var chatsDiv = document.querySelector('.chats');

    const filteredUsers = data.allusers.filter(user => !data.usersArray.includes(user));
    console.log(filteredUsers);
    var username = decodeURIComponent(document.cookie);
    var username = username.match(/"([^']+)"/)[1];
    filteredUsers.forEach((user) => {
        if (username == data.myCookie) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'participants';
            checkbox.value = user;
            checkbox.id = user;

            const label = document.createElement('label');
            label.textContent = user;
            label.setAttribute('for', user);

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);

            chatsDiv.appendChild(div);
        }
    });
});

function addmembersfunction() {
    var inputField = document.getElementById("myInput").value;

    const checkboxes = document.getElementsByName('participants');
    const selectedUsers = [];

    let isAnyCheckboxSelected = false;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedUsers.push(checkbox.value);
            isAnyCheckboxSelected = true;
        }
    });

    if (!isAnyCheckboxSelected) {
        alert("Please select users from the List");
    } else {
        console.log(selectedUsers);
        var data = {
            inputField,
            selectedUsers
        }
        socket.emit('addmembers', (data));
    }
}
socket.on('addmembersuccess', (data) => {
    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }
    var chatsDiv = document.querySelector('.chats');
    if (data) {
        const label = document.createElement('label');
        label.textContent = "Error in adding Please retry";
        chatsDiv.appendChild(label);
    } else {
        const label = document.createElement('label');
        label.textContent = "Members Added Successfully";
        chatsDiv.appendChild(label);
    }
});

//Remove group Members below code
removemembers.addEventListener('click', () => {
    console.log("working");
    var inputField = document.getElementById("myInput").value;

    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }

    var userInput = document.querySelector('.user-input');
    userInput.style.display = 'none';

    let div = document.createElement('div');
    let content = `
    <div style="display:flex;">   
        <h2>Remove Members :-</h2> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   
      <button onclick="removemembersfunction()" class="btn btn-primary btn1" id="creategroup" style="width:250px">Remove Members</button>
      </div>  <hr>   
    `;
    div.innerHTML = content;
    chats.appendChild(div);

    socket.emit('groupmembers', (inputField));
});

socket.on('groupmembers', (users) => {
    //console.log(users);
    var chatsDiv = document.querySelector('.chats');
    const myCookie = getCookie('zemail');
    users.forEach((user) => {
        if (user != myCookie) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'participants';
            checkbox.value = user;
            checkbox.id = user;

            const label = document.createElement('label');
            label.textContent = user;
            label.setAttribute('for', user);

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);

            chatsDiv.appendChild(div);
        }
    });
})

function removemembersfunction() {
    var inputField = document.getElementById("myInput").value;

    const checkboxes = document.getElementsByName('participants');
    const selectedUsers = [];

    let isAnyCheckboxSelected = false;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedUsers.push(checkbox.value);
            isAnyCheckboxSelected = true;
        }
    });
    if (!isAnyCheckboxSelected) {
        alert("Please select users from the List");
    } else {
        //console.log(selectedUsers);
        var data = {
            inputField,
            selectedUsers
        }
        socket.emit('removemembers', (data));
    }
}

socket.on('removemembersuccess', (data) => {
    deleteContent();

    function deleteContent() {
        var chatsDiv = document.querySelector('.chats');
        chatsDiv.innerHTML = '';
    }
    var chatsDiv = document.querySelector('.chats');
    if (data) {
        const label = document.createElement('label');
        label.textContent = "Error in Removing Members Please retry";
        chatsDiv.appendChild(label);
    } else {
        const label = document.createElement('label');
        label.textContent = "Members Removed Successfully";
        chatsDiv.appendChild(label);
    }
});


//Delete group below code
deletegroup.addEventListener('click', () => {
    var result = window.confirm("Do you really want to delete the group?");
    if (result) {
        var inputField = document.getElementById("myInput").value;
        socket.emit('deletegroup', (inputField));
    }
})

socket.on('deletegroupsuccess', () => {
    // Refresh the current page
    location.reload();
})

//Exit Group Code
exitgroup.addEventListener('click', () => {
    var result = window.confirm("Do you really want to Exit the group?");
    if (result) {
        var inputField = document.getElementById("myInput").value;
        const myCookie = getCookie('zemail');
        var data = { inputField, myCookie }
        socket.emit('exitgroup', (data));
    }
})

socket.on('exitgroupsuccess', () => {
    // Refresh the current page
    location.reload();
})