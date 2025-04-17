
// javascript for the add product form 
  // Get references to elements
  const addProductBtn = document.querySelector(".add-product-btn"); // Add product button
  const productFormContainer = document.getElementById("productFormContainer"); // Form container
  const cancelFormBtns = document.querySelectorAll("#cancelFormBtn, #cancelFormBtnBottom"); // Both cancel buttons
  
  // Show form when "Add Product" is clicked
    addProductBtn.addEventListener("click", function () {
    
  // reset from fields
    document.getElementById("productForm").reset(); // Clear form

  // reset the product ID to ensure it's not in edit mode and its a new product
    document.getElementById("productForm").removeAttribute("data-id"); // Remove product ID attribute
      
    // show the form
    productFormContainer.style.display = "block"; // Show form
  });
  
  // Hide form when "Cancel" is clicked
  cancelFormBtns.forEach(button => {
      button.addEventListener("click", function () {
          productFormContainer.style.display = "none"; // Hide form
      });
  });
  
  

//javascript for save product form to database

// Fetch categories from backend and populate the dropdown
async function loadCategories() {
    try {
        const response = await axios.get("https://webshop-2025-be-g1-blush.vercel.app/api/categories");
        const categories = response.data;

        const categorySelect = document.getElementById("productCategory");
        categorySelect.innerHTML = ""; // Clear existing options

        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category._id; // Save ID for backend
            option.textContent = category.name; // Show name in dropdown
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Call function when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadCategories(); // Load categories on page load

    //  Handle product form submission and send data to backend
document.getElementById("productForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const submitButton = event.submitter; //This gives the actual button used to submit..this is important so that we can diable it so that the user can't double click it
    submitButton.disabled = true; // Disable to prevent double-click and multiple submissions

    // Get product ID from the hidden field (if editing)
    const productId = document.getElementById("productForm").getAttribute("data-id");

    // To prevent discount defaulting to 100%
    const discountInput = document.getElementById('productDiscount');

    discountInput.addEventListener('blur', () => {
        const val = parseFloat(discountInput.value);
        
        // If value is empty, NaN, or less than 0, default to 0
        if (isNaN(val) || discountInput.value.trim() === '') {
            discountInput.value = 0;
        }
    });

    // Collect form data
    const productData = {
        image: document.getElementById("productImage").value,
        name: document.getElementById("productName").value,
        price: parseFloat(document.getElementById("productPrice").value, 10),
        unit: document.getElementById("productUnit").value,
        amount: parseFloat(document.getElementById("productQuantity").value, 10),
        brand: document.getElementById("productBrand").value,
        discount: 1- (parseFloat(document.getElementById("productDiscount").value)/100), // Converts % input to multiplier
        description: document.getElementById("productDescription").value,
        category: document.getElementById("productCategory").value, // Use category ID
        stock: parseInt(document.getElementById("productStock").value, 10),
        
    };
    console.log("Product Data:", productData);
    
    try {
        let response;
        if (productId) {
            console.log("Editing product:", productId, productData.name); // Debugging log
            // If editing, send PUT request to update product
            response = await axios.put(
                `https://webshop-2025-be-g1-blush.vercel.app/api/products/${productId}`, productData, {
                    headers: {
                        'hakim-livs-token': localStorage.getItem('hakim-livs-token')
                    }
                });
            console.log("Editing Product Response:", response); // Debugging log
        } else {    
            // If adding new product, send POST request
         response = await axios.post("https://webshop-2025-be-g1-blush.vercel.app/api/products", productData, {
            headers: {
                'hakim-livs-token': localStorage.getItem('hakim-livs-token')
            }
         });

        console.log("Response:", response); // Log API response
        }

        if (response.status === 200 || response.status === 201) {

            //alert("Product added successfully!");
            alert(productId ? "Product updated successfully!" : "Product added successfully!");
            document.getElementById("productForm").reset(); // Clear form
            document.getElementById("productFormContainer").style.display = "none"; // Hide form
            //loadProductList(); // Refresh product list
            await loadProductList(productId); // Reload products instantly and highlight the updated row
        } else {
            alert("Failed to save product.");
        }
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Error adding product. Please try again.");
    } finally {
        submitButton.disabled = false; // Re-enable button
    }
});
});

// Function to delete a product


async function deleteProduct(productId, productName) {
    const confirmDelete = confirm(`Are you sure you want to delete "${productName}"?`);
    
    if (!confirmDelete) {
        return; // Stop if user cancels
    }

    try {
        const response = await axios.delete("https://webshop-2025-be-g1-blush.vercel.app/api/products", {
            data: { id: productId }, // Send product ID in the request body
            headers: {
                'hakim-livs-token': localStorage.getItem('hakim-livs-token')
            }
        });

        if (response.status === 200) {
            alert(`"${productName}" has been deleted successfully!`);
            loadProductList(); // Refresh the product list after deletion
        } else {
            alert("Failed to delete product. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
    }
}

// Function to attach delete event listeners to buttons
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-btn"); // Select all delete buttons

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-id"); // Get product ID
            const productName = this.getAttribute("data-name");
            
            deleteProduct(productId, productName);
            
        });
    });
}



// Function to attach edit event listeners
function attachEditListeners() {
    const editButtons = document.querySelectorAll(".update-btn"); // Select all edit buttons

    editButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.getAttribute("data-id"); // Get product ID
            const productName = this.getAttribute("data-name"); // Get product name (optional)

            console.log("Editing product:", productId, productName); // Debugging log (check console)
            
            // Fetch product details from backend
            try {
                const response = await axios.get(`https://webshop-2025-be-g1-blush.vercel.app/api/products/${productId}`);
                const product = response.data;

                // show product form
                productFormContainer.style.display = "block";  
                // Scroll to the top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                
                // Fill in the form with product data
                document.getElementById("productImage").value = product.image;
                document.getElementById("productName").value = product.name;
                
                //document.getElementById("productPrice").value = product.price;
                document.getElementById("productPrice").value = product.price.toFixed(2); // Format price to 2 decimal places
                document.getElementById("productUnit").value = product.unit;
                document.getElementById("productQuantity").value = product.amount;
                document.getElementById("productBrand").value = product.brand;
                document.getElementById("productDiscount").value = ((1 - product.discount) * 100).toFixed(2); // Converting multiplier to %
                document.getElementById("productDescription").value = product.description;
                //document.getElementById("productCategory").value = product.category._id; // Use category ID
                document.getElementById("productStock").value = product.stock;
               
                // THIS LINE ENSURES THE FORM KNOWS IT'S AN EDIT
                document.getElementById("productForm").setAttribute("data-id", product._id);
                // Set category dropdown correctly
                const categoryDropdown = document.getElementById("productCategory");
                if (categoryDropdown) {
                    for (let option of categoryDropdown.options) {
                        if (option.value === product.category) {
                            option.selected = true;
                            break;
                        }
                    }
                }

            
            } catch (error) {
                console.error("Error fetching product data:", error);
                alert("failed to load product data. Please try again.");
            }
        });
    });
}

