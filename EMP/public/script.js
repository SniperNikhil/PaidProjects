const socket = io();


// Targeting all elemts
const empcode = document.getElementById("empcode");
const designation = document.getElementById("designation");
const doj = document.getElementById("doj");
const name = document.getElementById("name");
const dob = document.getElementById("dob");
const age = document.getElementById("age");
const experience = document.getElementById("experience");
const gender = document.getElementById("gender");
const proffid = document.getElementById("proffid");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const address = document.getElementById("address");

const month = document.getElementById("month");
const year = document.getElementById("inputYear");
const bsal = document.getElementById("bsalary");
const tdays = document.getElementById("tdays");
const absents = document.getElementById("absents");
const medical = document.getElementById("medical");
const pfund = document.getElementById("pfund");
const convence = document.getElementById("convence");
const netsalary = document.getElementById("netsalary");
//End of all elements


function disable() {
    const Update1 = document.getElementById('update');
    Update1.disabled = true;
    const Delete1 = document.getElementById('delete');
    Delete1.disabled = true;
}

disable()



// < !--Code for Calculate button-- >
const calculate1 = document.querySelector("#calnetsalary");
calculate1.addEventListener('click', async () => {
    const check = await checkValues("calculate");
    console.log(check)
    if (check == true) {
        const bsal = parseFloat(document.getElementById("bsalary").value);
        const tdays = parseInt(document.getElementById("tdays").value);
        const absents = parseInt(document.getElementById("absents").value);
        const medical = parseFloat(document.getElementById("medical").value);
        const pfund = parseFloat(document.getElementById("pfund").value);
        const convence = parseFloat(document.getElementById("convence").value);

        const perDay = bsal / tdays;
        const workDay = tdays - absents;
        const sal_ = perDay * workDay;
        const deduct = medical + pfund;
        const addition = convence;
        const netSal = sal_ - deduct + addition;

        const netsalary = document.getElementById("netsalary");
        netsalary.value = netSal.toFixed(2);

        const values = {
            companyName: "XYZ",
            address: "XYZ, Floor 4",
        };
        const today = new Date();
        const hours = today.getHours();
        const amPm = hours >= 12 ? 'PM' : 'AM';

        const formattedTime = today.toLocaleTimeString();

        const template = document.getElementById("template");
        const templateContent = `
 Company Name, ${values.companyName}
Address: ${values.address}
-----------------------------------
Employee ID     :   ${empcode.value}
Salary Of       :   ${month.value}-${year.value}
Generated On    :   ${today.getDate()}-${today.getMonth()}-${today.getFullYear()}
Generated Time  :   ${formattedTime}
-----------------------------------
Todays Days     :   ${tdays}
Total Present   :   ${tdays - absents}
Total Absents   :   ${absents}
Convence        :   Rs.${convence}
Medical         :   Rs.${medical}
PF              :   Rs.${pfund}
Gross Payment   :   Rs.${bsal}
Net Salary      :   Rs.${netSal.toFixed(2)}
-----------------------------------
This is a computer-generated slip,
not required any signature`;

        template.value = templateContent;
    }
})
//End of Calculate button



// <!-- Code to Dynamically calculate Age -->
function calculateAge() {
    const dobInput = document.getElementById("dob");
    const ageOutput = document.getElementById("age");

    if (dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const dobMonth = dob.getMonth();
        const todayMonth = today.getMonth();

        if (todayMonth < dobMonth || (todayMonth === dobMonth && today.getDate() < dob.getDate())) {
            age--;
        }

        ageOutput.value = `${age}`;
    } else {
        ageOutput.textContent = "Please enter a valid date of birth";
    }
}
//End Calculate Age



// <!-- Code for list of years -->
// Populate the year select dropdown with values from the current year to 100 years ago
document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();
    const yearSelect = document.getElementById('inputYear');

    for (let year = currentYear; year >= (currentYear - 100); year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
});
//End of list of years code



// Event listener for the "Clear" button
var clear = document.querySelector("#clear");
clear.addEventListener('click', () => {
    // Clear all input fields and reset the template content
    empcode.value = ""
    designation.value = ""
    doj.value = ""
    name.value = ""
    dob.value = ""
    age.value = ""
    experience.value = ""
    gender.value = "Select"
    proffid.value = ""
    email.value = ""
    contact.value = ""
    address.value = ""

    month.value = "January"
    const currentYear = new Date().getFullYear();
    year.value = currentYear
    bsal.value = ""
    tdays.value = ""
    absents.value = ""
    medical.value = ""
    pfund.value = ""
    convence.value = ""
    netsalary.value = ""

    // ... (Repeat for all other fields)
    const template = document.getElementById("template");
    const templateContent = `
    Company Name, XYZ
    Address: XYZ, Floor4       
-----------------------------------
Employee ID     :   
Salary Of       :   Mon-YYYY
Generated On    :   DD-MM-YYYY
Generated Time  :   ------
-----------------------------------
Todays Days     :   DD
Total Present   :   DD
Total Absents   :   DD
Convence        :   Rs.----
Medical         :   Rs.----
PF              :   Rs.----
Gross Payment   :   Rs.-------
Net Salary      :   Rs.-------
-----------------------------------
This is a computer-generated slip, 
not required any signature `;

    // Reset the template content
    template.value = templateContent;

    disable()
    const Save1 = document.getElementById('save');
    Save1.disabled = false;
})
//End of clear button



// Function to get values from the input fields and return them as an object
async function getValues() {
    const template = document.getElementById("template");
    const values = {
        empcode: empcode.value,
        designation: designation.value,
        doj: doj.value,
        name: name.value,
        dob: dob.value,
        age: age.value,
        experience: experience.value,
        gender: gender.value,
        proffid: proffid.value,
        email: email.value,
        contact: contact.value,
        address: address.value,
        month: month.value,
        year: year.value,
        bsal: bsal.value,
        tdays: tdays.value,
        absents: absents.value,
        medical: medical.value,
        pfund: pfund.value,
        convence: convence.value,
        netsalary: netsalary.value,
        template: template.value
    }
    return values;
}
//End of Function to get values from the input fields and return them as an object



// Function to check if all required values are filled in
async function checkValues(object) {
    if (object == "save") {
        const values = await getValues();

        for (const key in values) {
            if (!values[key] || values[key].trim() === "") {
                // Value is empty or contains only spaces
                alert(`Please fill in the '${key}' field.`);
                return false; // You can return or handle the error as needed
            }
        }

        // All values are filled in
        return true;
    }
    if (object == "calculate") {
        const values = await getValues();

        for (const key in values) {
            if (key === 'netsalary') {
                continue; // Skip 'netsalary'
            }

            if (!values[key] || values[key].trim() === "") {
                alert(`Please fill in the '${key}' field.`);
                return false;
            }
        }
        return true;
    }
}



// Event listener for the "Save" button
var save = document.querySelector("#save");
save.addEventListener('click', async () => {
    // Check if all required values are filled in before saving
    const check = await checkValues("save");
    if (check) {
        const values = await getValues();
        console.log(values)

        const Update1 = document.getElementById('update');
        Update1.disabled = false;
        const Delete1 = document.getElementById('delete');
        Delete1.disabled = false;

        socket.emit("save", values);
    }
})



// Listen for a successful save event and update event and show an alert
socket.on('savesuccess', (success) => {
    alert(success);
})



//Code for Modal Box All Employee
// Get references to the modal and the button that opens it
var modal = document.getElementById('myModal');
var openBtn = document.getElementById('openModal');
var closeBtn = document.getElementById('closeModal');

// When the user clicks the open button, display the modal
openBtn.onclick = function () {
    modal.style.display = 'block';
}

// When the user clicks the close button, hide the modal
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

// When the user clicks outside the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
//End of Code for Modal Box All Employee



//Code For Search Button
const Search = document.getElementById("search");
Search.addEventListener('click', async () => {
    const values = await getValues();
    if (values.empcode != "") {
        const Save1 = document.getElementById('save');
        Save1.disabled = true;
        const Update1 = document.getElementById('update');
        Update1.disabled = false;
        const Delete1 = document.getElementById('delete');
        Delete1.disabled = false;

        socket.emit("search", values.empcode)
    } else {
        alert("Please enter the employee id")
    }
})

socket.on("searchedemployee", async (searchedemployee, template) => {
    const template1 = document.getElementById("template")

    empcode.value = searchedemployee[0].empcode;
    designation.value = searchedemployee[0].designation;
    doj.value = searchedemployee[0].doj
    name.value = searchedemployee[0].name
    dob.value = searchedemployee[0].dob
    age.value = searchedemployee[0].age
    experience.value = searchedemployee[0].experience
    gender.value = searchedemployee[0].gender
    proffid.value = searchedemployee[0].proffid
    email.value = searchedemployee[0].email
    contact.value = searchedemployee[0].contact
    address.value = searchedemployee[0].address

    month.value = searchedemployee[0].month
    year.value = searchedemployee[0].year
    bsal.value = searchedemployee[0].bsal
    tdays.value = searchedemployee[0].tdays
    absents.value = searchedemployee[0].absents
    medical.value = searchedemployee[0].medical
    pfund.value = searchedemployee[0].pfund
    convence.value = searchedemployee[0].convence
    netsalary.value = searchedemployee[0].netsalary
    template1.value = template
})

socket.on("emptysearch", async (emptysearch) => {
    alert(emptysearch)
})
//End of Code For Search Button



//Code For Update Button
const Update = document.getElementById("update")

Update.addEventListener('click', async () => {
    var button = document.getElementById("calnetsalary");
    await button.click();
    const check = await checkValues("save");
    if (check) {
        const values = await getValues();
        console.log(values)
        socket.emit("update", values);
    }
})
//End of Update Logic



//Code for delete button
const Delete = document.getElementById("delete");
Delete.addEventListener('click', async () => {
    const values = await getValues();
    if (values.empcode != "") {
        if (window.confirm("Do you want to delete?")) {
            socket.emit("delete", values.empcode)
        }
    } else {
        alert("Please enter the employee id")
    }
})

socket.on('deletesuccess', (success) => {
    if (confirm(success)) {
        window.location.reload();
    }
})
//End of delete Code



//code for printing
const printButton = document.getElementById("print");
const textarea = document.getElementById("template");

printButton.addEventListener("click", function () {
    const contentToPrint = textarea.value;
    const printWindow = window.open('', '_self'); // Open in the same tab/window
    printWindow.document.write('<html><head><title>Printed Content</title></head><body>');
    printWindow.document.write('<pre>' + contentToPrint + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
    printWindow.close();
    window.location.reload()
});