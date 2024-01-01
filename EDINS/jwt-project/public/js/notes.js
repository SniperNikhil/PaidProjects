const socket = io();
var clickhere = document.querySelector("#clickhere");

clickhere.addEventListener('click', () => {
    var email1 = document.getElementById("email");
    var sem1 = document.getElementById("sem");
    const email = email1.value;
    const sem = sem1.value;
    var data = { email, sem }
    socket.emit("viewnotesstudents", (data));
});
socket.on('viewnotesstudent', (data) => {
    const cardBody = document.getElementById("cardBody");

    function generateCardContents() {
        cardBody.innerHTML = ""; // Clear the card body

        const semesterHeader = document.createElement("h4");
        semesterHeader.textContent = `${data.sem}:`;
        cardBody.appendChild(semesterHeader);

        data.files.forEach((file, index) => {
            const fileLabel = document.createElement("label");
            fileLabel.textContent = `${index + 1}) ${file} -->`;

            const downloadLink = document.createElement("a");
            downloadLink.href = `/download/${data.email}/${data.sem}/${file}`;
            downloadLink.textContent = "Download";
            downloadLink.className = "btn btn-primary btn1";

            const previewButton = document.createElement("button");
            previewButton.textContent = "Preview";
            previewButton.className = "btn btn-primary btn1";
            previewButton.onclick = () => openPdf(data.email, data.sem, file);

            cardBody.appendChild(fileLabel);
            cardBody.appendChild(downloadLink);
            cardBody.appendChild(previewButton);

            const spacingDiv = document.createElement("div");
            spacingDiv.style.height = "10px"; // Set the desired height
            cardBody.appendChild(spacingDiv);
            const lineBreak = document.createElement("br");
            cardBody.appendChild(lineBreak);
            cardBody.appendChild(lineBreak);
        });
    }
    // Call the function to generate and append the content when needed
    generateCardContents();
})
