

// Function to add click event listener to each checkin row
function setupCheckinRowClickListeners() {
    const rows = document.querySelectorAll("#oldcheckoutsTableBody tr");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            rows.forEach(r => r.classList.remove("highlighted"));

            // Add 'highlighted' class to the clicked row
            row.classList.add("highlighted");

            // Extract values from the clicked row
            const cells = row.cells; // Get all cells in the row
            const values = Array.from(cells).map(cell => cell.textContent); // Get text content of each cell

            
            // Set form fields with values from the clicked row
            // Store values in variables
            // const cname = values[1];
            // const contact = values[2];
            // const checkInDate = values[3];
            // const checkOutDate = values[4];
            // const category = values[5];
            // const floorNo = values[6];
            // const roomNo = values[7];
            // const price = values[8];
            // const total = values[9];
            // const advance = values[10];
            // const balance = values[11];
        });
    });
}
setupCheckinRowClickListeners();

function getTDValuesByClassName(className) {
    // Find the row with the specified class name
    const row = document.querySelector(`tr.${className}`);

    // Initialize an array to store the <td> values
    const tdValues = [];

    // If the row is found, iterate over each <td> element within the row
    if (row) {
        row.querySelectorAll("td").forEach(td => {
            // Push the text content of each <td> to the tdValues array
            tdValues.push(td.textContent.trim());
        });
    }

    // Return the array of <td> values
    return tdValues;
}


const printbtn = document.getElementById('printbtn')
printbtn.addEventListener('click', () => {
    const highlightedTDValues = getTDValuesByClassName("highlighted");
    console.log(highlightedTDValues)
    const printContent = `
    <div class="checkoutbill" id="printbill">
    <div class="header1">
        <img src="images.jpg" alt="Hotel Logo">
        <div class="billhead">
            <h1>Coding.Alphas Hotel</h1>
            <p>Address: 123 Main Street, Cityville</p>
            <p>Contact: +1234567890</p>
            <p for="" style="float: left;">Invoice No:</p>
            <p id="billinvoice">${highlightedTDValues[2]}</p>
        </div>
    </div>

    <div class="billcustomerdetails" >
        <div class="adhed">
            <label for="">Customer Details</label>
        </div>
        <div class="cddata">
            <div class="cdname">
                <label for="">Issue Date:</label>
                <label for="" id="billissuedate">${highlightedTDValues[3]}</label>
            </div>
            <div class="cdname">
                <label for="">Name :</label>
                <label for="" id="billname">${highlightedTDValues[1]}</label>
            </div>
            <div class="cdcontact">
                <label for="">Contact :</label>
                <label for="" id="billcontact">${highlightedTDValues[4]}</label>
            </div>
            <div class="cdcheckin">
                <label for="">CheckIn :</label>
                <label for="" id="billcheckindate">${highlightedTDValues[5]}</label>
            </div>
            <div class="cdcheckout">
                <label for="">CheckOut :</label>
                <label for="" id="billcheckoutdate">${highlightedTDValues[6]}</label>
            </div>
            <div class="cdnoofdays">
                <label for="">No of Days :</label>
                <label for="" id="billnoofdays">${highlightedTDValues[7]}</label>
            </div>
            <div class="cdroomno">
                <label for="">Room No :</label>
                <label for="" id="billroomno">${highlightedTDValues[9]}</label>
            </div>
        </div>
    </div>
    <div class="billtotalamount">
        <div class="amount">
            <label for="" id="billtotalamount">Rs.${highlightedTDValues[10]}/-</label>
        </div>
    </div>
    <div class="billnote">
        <label for="">Note : </label>
        <label for="">Computer Generated bill does not require signature</label>
    </div>
</div>
    `;

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
                    transform: scale(1.2);
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