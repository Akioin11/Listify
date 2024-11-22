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
        Material: The fabric/material of the clothing. All in JSON format.
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
    
            console.log(result); // Log the entire result for debugging
    
            if (result && result.ai_response) {
                let aiResponse = result.ai_response;
    
                console.log(aiResponse); // Log the raw AI response
    
                // Step 1: Remove Markdown-style code fences
                aiResponse = aiResponse.replace(/```json|```/g, '').trim();
    
                // Step 2: Parse the cleaned JSON
                try {
                    const recipes = JSON.parse(aiResponse); // Parse JSON string to an array
    
                    console.log("Processed recipes:", recipes);
    
                    // Create table rows dynamically from parsed recipes
                    const tableBody = document.getElementById("productTableBody");
                    tableBody.innerHTML = ''; // Clear previous table content
    
                    recipes.forEach((recipe) => {
                        const row = document.createElement("tr");
    
                        // Add recipe name
                        const nameCell = document.createElement("td");
                        nameCell.innerText = recipe.recipe_name;
                        row.appendChild(nameCell);
    
                        // Add ingredients
                        const ingredientsCell = document.createElement("td");
                        ingredientsCell.innerText = recipe.ingredients.join(", ");
                        row.appendChild(ingredientsCell);
    
                        // Append the row to the table
                        tableBody.appendChild(row);
                    });
    
                    // Show the table in the UI
                    document.getElementById("productTableWrapper").style.display = "block";
    
                } catch (e) {
                    console.error("Error parsing AI response:", e);
                    document.getElementById("output").innerText = `Error parsing response: ${e.message}`;
                }
    
            } else {
                console.log("AI response is not available.");
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
