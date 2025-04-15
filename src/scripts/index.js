import { fetchProducts, showWelcomeMessage } from "../utils/api.js";
import loadUserContext from "../utils/userContext.js"
import loadHeader from "./header.js";
import {
  addProductToCart,
  getCartFromLocalStorage,
  saveCartToLocalStorage,
  updateLocalStorageCart,
  updateDOMWithCartData,
} from "../utils/cartFunctions.js";
// import { toggleAdminLink } from "../utils/api.js";

index()

async function index() {
  await loadUserContext()
  await loadHeader()
  await loadProducts();
  updateDOMWithCartData();
  showWelcomeMessage()
}

// Function to fetch and render products
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>&nbsp; Laddar produkter... </p>"; // Temporary message while loading

  try {
    const products = await fetchProducts();
    productsContainer.innerHTML = ""; // Clear loading text

    if (products.length > 0) {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML = "<p>Inga produkter tillgängliga.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p class=`error-msg`>🤷 Något gick fel vid inladdning av produkterna. </p>";
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";

  element.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.price.toFixed(2)} kr</p>
    <button class="add-to-cart-btn">Lägg i varukorg</button>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addProductToCart(product);
  });

  return element;
}

