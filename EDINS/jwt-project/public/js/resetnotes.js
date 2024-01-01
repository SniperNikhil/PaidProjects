const socket = io();
function resetFiles() {
    if (confirm('Note: All files Uploaded by you will be deleted. Do you really want to Reset?')) {
        // Emit the 'deleteFiles' event to the server to initiate the file deletion process
        var email = getCookie("zemail");
        //console.log(email);
        socket.emit('deleteFiles', email);
    }
}
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

socket.on('deletionSuccess', (data) => {
    console.log(data.message);
    location.reload();
    // Implement any success feedback to the user (e.g., show a success message)
});

socket.on('deletionError', (data) => {
    console.error(data.message);
    // Implement any error feedback to the user (e.g., show an error message)
});