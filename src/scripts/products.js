import { fetchProducts, fetchCategories, showWelcomeMessage } from "../utils/api.js";
import loadUserContext from "../utils/userContext.js";
import loadHeader from "./header.js";
import loadFooter from "./footer.js";
import {
  addProductToCart,
  removeProductFromCart,
  updateDOMWithCartData,
} from "../utils/cartFunctions.js";

productsPage()

async function productsPage() {
  await loadUserContext()
  await loadHeader()
  await loadFooter()
  renderCategoryButtons()
  await loadProducts()
  updateDOMWithCartData()
}


function createCategoryButton(category) {
  const btn = document.createElement("button");
  btn.classList.add(`category-button`);
  btn.innerText = category.name;

  const arrow = document.createElement('img')
  arrow.src = `/img/rarr.svg`
  arrow.width = 30
  btn.append(arrow)

  btn.addEventListener("click", function () {
    // Define a function that will be called when the category-button is clicked:
    handleCategoryButtonClick(category.name, btn);
  });
  return btn;
}

async function renderCategoryButtons() {
  const categories = await fetchCategories();
  const container = document.querySelector("#category-buttons");

  const allProductsBtn = document.createElement("button");
  allProductsBtn.innerText = "Alla produkter";
  allProductsBtn.classList.add("category-button");
  allProductsBtn.classList.add("selected")
  const arrow = document.createElement('img')
  arrow.src = `/img/rarr.svg`
  arrow.width = 30
  allProductsBtn.append(arrow)
  allProductsBtn.addEventListener("click", () => {
    loadProducts()
    document.querySelectorAll('.category-button').forEach(btn => {
      if (btn === allProductsBtn) {
        btn.classList.add('selected')
      } else {
        btn.classList.remove('selected')
      }
    })
  });
  container.appendChild(allProductsBtn);

  categories.forEach((category) => {
    const btn = createCategoryButton(category);
    container.appendChild(btn);
  });
}

// fetch to the backend to get all the products of the given category, and filter them Locally
// ( consider adding a function to api.js for this ... ? )
async function handleCategoryButtonClick(categoryName, btn) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p class='laddar-produkter'>&nbsp; Laddar produkter... <br> <span class='big'>👁👄👁</span></p> ";

  // remove selected from all category buttons except the one clicked
  document.querySelectorAll('.category-button').forEach(btn2 => {
    if (btn === btn2) {
      btn2.classList.add('selected')
    } else {
      btn2.classList.remove('selected')
    }
  })

  try {
    const allProducts = await fetchProducts(); // Get all products first, unfiltered
    const filteredProducts = allProducts.filter(
      // once fetched, filter them locally
      (product) => product.category.name === categoryName
    );
    productsContainer.innerHTML = ""; // Clear prev products

    if (filteredProducts.length > 0) {
      filteredProducts.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML = `<p class="error-msg">&nbsp; Inga produkter fanns visst att hämta inom denna kategori.</p> 🤷🤷 <br>`;
    }
  } catch (error) {
    console.error("✗ Error fetching filtered products:", error);
    productsContainer.innerHTML = `<p class="error-msg"><i>&nbsp; Hoppsan! 🤷<br> Något ville inte när vi försökte ladda de filtrerade produkterna. </i> &nbsp;</p> ¯\_(ツ)_/¯`;
  }
  updateDOMWithCartData()
}

// Function to fetch and render products
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p class='laddar-produkter'>&nbsp; Laddar produkter... <br> <span class='big'>👁👄👁</span></p> ";

  //#region Sort-btn code draft
  // //  Functionality for sorting alphabetically, unfinished (for sprint2): //
  // let sortBtn = document.getElementById("#sortBtn");
  // productsContainer.innerHTML = `
  //   <button id="sortBtn">Sort alphabetically</button>`;
  // products.sort((a, b) => a.name.localeCompare(b.name));
  //#endregion

  try {
    const products = await fetchProducts();
    productsContainer.innerHTML = ""; // Clear loading text;

    if (products.length > 0) {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML =
        "<p class=`error-msg`> Inga produkter fanns att hämta. 🤷</p>";
    }
  } catch (error) {const count = 0
		
		return countiner.innerHTML =
      "<p class=`error-msg`>🤷 Något gick fel vid inladdning av produkterna. </p>";
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";
  element.dataset.id = product._id

  const price = product.price

  element.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
		<h4><i> ${product.brand}</i>, ${product.amount}${product.unit}</h4>
    <p>${price.toFixed(2)} kr</p>
    <div class="spacer"></div>
    <div class="product-card-controls">
      <button class="remove-from-cart-btn">-</button>
      <p class="product-count-${product._id}">0</p>
      <button class="add-to-cart-btn">+</button>
    </div>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addProductToCart(product);
    updateDOMWithCartData()
  });

  element.querySelector(".remove-from-cart-btn").addEventListener("click", () => {
    removeProductFromCart(product._id);
    updateDOMWithCartData()
  });

  return element;
}

