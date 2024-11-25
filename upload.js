document.addEventListener('DOMContentLoaded', function () {
    const addFileButton = document.getElementById("addFileButton");
    const removeFileButton = document.getElementById("removeFileButton");
    const fileTableBody = document.getElementById("fileTableBody");
    const uploadForm = document.getElementById("uploadForm");

//const fixedPrompt = `List a few popular cookie recipes in JSON format.
//Use this JSON schema:
//Recipe = {'recipe_name': str, 'ingredients': list[str]}
//Return: list[Recipe]`
//Fixed prompt for AI response

    const fixedPrompt = `Only give the required fields, no explanations or disclaimers, those are already provided on the front end. Be concise.
        Material: The fabric/material of the clothing. Include more details in title and include more keywords. All in JSON format.
        Use this JSON schema:
        Price (in rs): Estimated price in INR.
        Amazon listing title: A short title for the product.
        Keywords: One or two relevant keywords for the item.
        Color: The primary color of the clothing.
        keywords: keywords for better search matching and seo
        Type: Type of clothing (e.g., t-shirt, jeans).
        Use this response scheme:
        details = (title': str, 'price': str, 'color': str, 'type': str, 'keywords': list[str])`;

    //Add File
    addFileButton.addEventListener('click', function () {
        const row = document.createElement("tr");

        const fileCell = document.createElement("td");
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "file";
        fileInput.required = true;
        fileCell.appendChild(fileInput);

        row.appendChild(fileCell);
        fileTableBody.appendChild(row);

        // Show the "Remove Last File" button once at least one file input exists
        removeFileButton.style.display = "inline-block";
    });

    // Remove the last file input field when the "Remove Last File" button is clicked
    removeFileButton.addEventListener('click', function () {
        if (fileTableBody.rows.length > 1) {
            fileTableBody.deleteRow(fileTableBody.rows.length - 1);
        }

        // Hide the "Remove Last File" button if there are no more file inputs
        if (fileTableBody.rows.length <= 1) {
            removeFileButton.style.display = "none";
        }
    });

    async function uploadFiles(event) {
        event.preventDefault();
    
        const formData = new FormData();
        const fileInputs = document.querySelectorAll("input[type='file']");
    
        // Append all selected files to the FormData object
        fileInputs.forEach((input) => {
            if (input.files[0]) {
                formData.append("file", input.files[0]);
            }
        });
    
        // Append the fixed prompt to the FormData object
        formData.append("prompt", fixedPrompt);
    
        try {
            const response = await fetch("http://13.202.188.112:5000/upload", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to upload files to the server");
            }
    
            const result = await response.json();
            console.log("Server response:", result); // Log the entire result
    
            if (result && result.ai_response) {
                let aiResponse = result.ai_response;
                console.log("Raw AI response:", aiResponse);
    
                // Step 1: Remove Markdown-style code fences and clean up the response
                const cleanedResponse = aiResponse.replace(/```json|```/g, '').trim();
                console.log("Cleaned AI response:", cleanedResponse);
    
                // Step 2: Attempt to parse the JSON
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(cleanedResponse);
                    console.log("Parsed response:", parsedResponse);
                } catch (parseError) {
                    throw new Error(`Failed to parse JSON: ${parseError.message}`);
                }
    
                // Step 3: Normalize response to array if it's not already
                const detailsArray = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
                console.log("Normalized details array:", detailsArray);
    
                // Step 4: Populate the table
                const tableBody = document.getElementById("productTableBody");
                tableBody.innerHTML = ''; // Clear previous table content
    
                detailsArray.forEach((details, index) => {
                    if (typeof details !== "object" || details === null) {
                        console.warn(`Invalid entry at index ${index}:`, details);
                        return;
                    }
    
                    const row = document.createElement("tr");
    
                    // Add title
                    const titleCell = document.createElement("td");
                    titleCell.innerText = details.title || "N/A";
                    row.appendChild(titleCell);
    
                    // Add price
                    const priceCell = document.createElement("td");
                    priceCell.innerText = details.price || "N/A";
                    row.appendChild(priceCell);
    
                    // Add color
                    const colorCell = document.createElement("td");
                    colorCell.innerText = details.color || "N/A";
                    row.appendChild(colorCell);
    
                    // Add type
                    const typeCell = document.createElement("td");
                    typeCell.innerText = details.type || "N/A";
                    row.appendChild(typeCell);
    
                    // Add keywords
                    const keywordsCell = document.createElement("td");
                    keywordsCell.innerText = details.keywords ? details.keywords.join(", ") : "N/A";
                    row.appendChild(keywordsCell);
    
                    // Append the row to the table
                    tableBody.appendChild(row);
                });
    
                // Show the table in the UI
                document.getElementById("productTableWrapper").style.display = "block";
    
            } else {
                console.warn("AI response is not available.");
                document.getElementById("output").innerText = "AI response not available.";
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("output").innerText = `Error: ${error.message}`;
        }
    }
    

    // Bind the submit event to the form
    uploadForm.addEventListener('submit', uploadFiles);
});
