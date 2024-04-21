//Code For Logout
const logout = document.getElementById("logout")
logout.addEventListener('click', () => {
    const confirmed = window.confirm("Do you really want to logout?")
    if (confirmed) {
        fetch('/Logout', {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server Did Not Respond");
                }
                window.location.href = '/';
            })
            .catch(err => {
                alert(err);
            });
    }
});
//----------------------------------------------------------------------------------

//Code for current time on index page
function updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const currentTimeLabel = document.getElementById("currentTimeLabel")

    if (currentTimeLabel) {
        currentTimeLabel.textContent = formattedTime;
    }
}
updateTime()
setInterval(updateTime, 1000);
//----------------------------------------------------------------------------------

//Below Code is to make the Update Profile div visible onclick of updateprofile
let updatename = document.getElementById("updatename")
let nametobeupdated = document.getElementById("nametobeupdated")
if (updatename && nametobeupdated) {
    updatename.addEventListener('click', () => {
        nametobeupdated.style.display = 'block'
    })
}
