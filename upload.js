document.addEventListener('DOMContentLoaded', function () {
    const addFileButton = document.getElementById("addFileButton");
    const fileTableBody = document.getElementById("fileTableBody");
    const uploadForm = document.getElementById("uploadForm");

    // Add file input fields dynamically when the "Add Another File" button is clicked
    addFileButton.addEventListener('click', function () {
        const row = document.createElement("tr");

        const fileCell = document.createElement("td");
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "file";
        fileInput.required = true;
        fileCell.appendChild(fileInput);

        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("removeFileButton");
        removeButton.textContent = "Remove";
        actionCell.appendChild(removeButton);

        row.appendChild(fileCell);
        row.appendChild(actionCell);
        fileTableBody.appendChild(row);

        // Add event listener to remove the file input row
        removeButton.addEventListener('click', function () {
            row.remove();
        });
    });

    // Upload files to the server
    async function uploadFiles(event) {
        event.preventDefault();

        const formData = new FormData();
        const fileInputs = document.querySelectorAll("input[type='file']");
        const promptInput = document.getElementById("promptInput").value;

        // Append all selected files to the FormData object
        fileInputs.forEach((input) => {
            if (input.files[0]) {
                formData.append("file", input.files[0]);
            }
        });

        // Append the prompt to the FormData object
        formData.append("prompt", promptInput);

        try {
            const response = await fetch("http://13.202.188.112:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload files to the server");
            }

            const result = await response.json();
            document.getElementById("output").innerText = `AI Response: ${result.ai_response}`;
        } catch (error) {
            document.getElementById("output").innerText = `Error: ${error.message}`;
        }
    }

    // Bind the submit event to the form
    uploadForm.addEventListener('submit', uploadFiles);
});
