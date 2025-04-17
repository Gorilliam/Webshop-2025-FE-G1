// Function to fetch product data and fill in the table using axios
async function loadProductList(updatedProductId = null) {
    try {
      console.log("Loading product list...");
      // Make an axios GET request to fetch product data from the backend
      const response = await axios.get('https://webshop-2025-be-g1-blush.vercel.app/api/products');  
      
      // The product data is available in the response.data property
      const products = response.data;
  
      // Get the tbody element where rows will be inserted
      const tableBody = document.getElementById('productBody');
      tableBody.innerHTML = ""; // Clear old product list
      // Loop through the products and add each one as a row in the table
      products.forEach(product => {
        const row = document.createElement('tr');
        row.setAttribute("data-id", product._id); //Add a data attribute
  
        row.innerHTML = `
          <td><img src="${product.image}" alt="${product.name}" width="50" height="50"></td>
          <td>${product.name}</td>
          <td>${(product.price).toFixed(2)}:-</td>
          <td>${product.amount} ${product.unit}</td> 
          <td>${product.brand}</td>
          <td>${((1 - product.discount) * 100).toFixed(2)}%</td>
          <td>${product.description}</td>
          <td>${product.category.name}</td>
          <td>${product.stock}</td>
          <td>
            <div class="button-group">
              <button class="update-btn" data-id="${product._id}" data-name="${product.name}">
                <i class="fas fa-edit"></i>
                Redigera
              </button>
              <button class="delete-btn" data-id="${product._id}" data-name="${product.name}">
                <i class="fas fa-trash-alt"></i>
                Ta bort
              </button>
            </div>
          </td>
        `;
  
        // Append the row to the table body
        tableBody.appendChild(row);

        // Highlight the updated product
        if (updatedProductId && product._id === updatedProductId) {
          row.classList.add("highlight");
          setTimeout(() => row.classList.remove("highlight"), 2000); // Remove effect after 2 sec
      }
      });
    
    attachDeleteListeners(); // Attach event listeners to new delete buttons
    attachEditListeners(); // Attach event listeners to edit buttons
    } catch (error) {
      // Handle error in case of failure
      console.error('Error loading product data:', error);
      alert('Error loading product data. Please try again later.');
    }
  }
  
  // Call the function to load the product list when the page is loaded
  window.onload = loadProductList;


  
  