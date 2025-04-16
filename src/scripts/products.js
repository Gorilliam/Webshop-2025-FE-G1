import { fetchProducts, fetchCategories, showWelcomeMessage } from "../utils/api.js";
import loadUserContext from "../utils/userContext.js";
import loadHeader from "./header.js";
import loadFooter from "./footer.js";
import {
  addProductToCart,
  removeProductFromCart,
  updateDOMWithCartData,
} from "../utils/cartFunctions.js";

// CONSTANTS
const PER_PAGE = 10

// DOM
const productsContainer = document.getElementById("products");
const categoryContainer = document.getElementById("category-buttons")

// STATE
let allProducts = []
let selectedCategory = "Alla produkter"
let page = 1

// MAIN FUNCTION
productsPage()
async function productsPage() {
  await loadUserContext()
  await loadHeader()
  await loadFooter()
  await renderCategoryButtons()
  await updateProducts("Alla produkter")
  updateDOMWithCartData()
}

// ---------- other functions


function createCategoryButton(category, makeSelected) {
  const btn = document.createElement("button");
  btn.classList.add(`category-button`);
  btn.dataset.category = category.name
  if (makeSelected) btn.classList.add('selected')
  btn.innerText = category.name;

  const arrow = document.createElement('img')
  arrow.src = `/img/rarr.svg`
  arrow.width = 30
  btn.append(arrow)

  btn.addEventListener("click", function () {
    // Define a function that will be called when the category-button is clicked:
    updateProducts(category.name, btn);
  });
  return btn;
}

async function renderCategoryButtons() {
  const categories = await fetchCategories();
  const container = document.querySelector("#category-buttons");

  const allBtn = createCategoryButton({ name: "Alla produkter" }, true)
  container.append(allBtn)

  categories.forEach((category) => {
    const btn = createCategoryButton(category);
    container.appendChild(btn);
  });
}

// get the index of the first and last products to show
function getStartAndEnd() {
  return [
    (page-1) * PER_PAGE,
    page * PER_PAGE
  ]
}

function getFilteredProducts() {
  let products = [...allProducts]

  if (selectedCategory !== "Alla produkter") {
    products = products.filter(p => p.category.name === selectedCategory)
  }

  return products
}

function getCurrentPage() {
  let products = getFilteredProducts()
  const [start, end] = getStartAndEnd()
  products = products.slice(start, end)
  return products
}

function displayLoadingMessage() {
  productsContainer.innerHTML = "<p class='laddar-produkter'>&nbsp; Laddar produkter... <br> <span class='big'>👁👄👁</span></p> ";
}

function displayErrorMessage() {
  productsContainer.innerHTML = `<p class="error-msg"><i>&nbsp; Hoppsan! 🤷<br> Något ville inte när vi försökte ladda de filtrerade produkterna. </i> &nbsp;</p> ¯\_(ツ)_/¯`;
}

function displayNoProductsMessage() {
  productsContainer.innerHTML = `<p class="error-msg">&nbsp; Inga produkter fanns visst att hämta inom denna kategori.</p> 🤷🤷 <br>`;
}

function selectButton(btn = document.querySelector(`.category-button[data-category="${selectedCategory}"]`)) {
  // remove selected from all category buttons except the one clicked
  document.querySelectorAll('.category-button').forEach(_btn => {
    if (btn === _btn) {
      _btn.classList.add('selected')
    } else {
      _btn.classList.remove('selected')
    }
  })
}

async function updateProducts(categoryName, btn) {
  displayLoadingMessage()
  selectButton(btn)

  try {
    allProducts = await fetchProducts(); // Get all products first, unfiltered

    // If selecting a different category than before, reset the page number.
    if (selectedCategory != categoryName) page = 1;

    selectedCategory = categoryName;
    const filteredProducts = getCurrentPage()

    productsContainer.innerHTML = ""; // Clear prev products  

    if (filteredProducts.length < 1) {
      displayNoProductsMessage()
      updateDOMWithCartData()
      renderPagination()
      return
    }

    filteredProducts.forEach((product) => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });

  } catch (error) {
    console.error("✗ Error fetching filtered products:", error);
    displayErrorMessage()
  }

  updateDOMWithCartData()
  renderPagination()
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

function renderPagination() {
  document.getElementById('pagination')?.remove()
  const filteredProducts = getFilteredProducts()
  const pageCount = Math.ceil(filteredProducts.length/PER_PAGE)
  if (pageCount < 1) return;
  categoryContainer.insertAdjacentHTML('beforeend', `
    <div id="pagination">
      <div>
        ${page <= 1 ? "":`
          <button id="pagination-left">
            <img src="/img/larr.svg" alt="vänster pil" />
          </button>
        `}
      </div>
      <p>
        sida ${page} av ${pageCount}
      </p>
      <div>
        ${page >= pageCount ? "":`
          <button id="pagination-right">
            <img src="/img/rarr.svg" alt="höger pil" />
          </button>
        `}
      </div>
    </div>
  `)

  document.getElementById('pagination-left')?.addEventListener('click', () => turnPage(-1))
  document.getElementById('pagination-right')?.addEventListener('click', () => turnPage(1))
}

function turnPage(by) {
  page += by
  updateProducts(selectedCategory)
}