import {
  updateDOMWithCartData,
  getAggregatedCart,
} from "../utils/cartFunctions.js";
import { showWelcomeMessage } from "../utils/api.js";
import loadHeader from "./header.js";
import loadFooter from "./footer.js";
import loadUserContext from "../utils/userContext.js";

// DOM
const form = document.querySelector("form");
const orderBtn = document.querySelector("#order-button");
const formErrorSpan = document.querySelector(".form-error");
const displayError = (msg = "") => (formErrorSpan.innerText = msg);

// Auto-fill form with data from localStorage if user is logged in
const firstName = localStorage.getItem("firstName");
const lastName = localStorage.getItem("lastName");
const email = localStorage.getItem("userEmail");

if (firstName) form.firstName.value = firstName;
if (lastName) form.lastName.value = lastName;
if (email) form.email.value = email;

const miniCartContainer = document.querySelector(".mini-cart-container");

checkoutPage();
async function checkoutPage() {
  // startup
  await loadUserContext();
  await loadHeader();
  await loadFooter();
  updateDOMWithCartData();
  renderCheckoutForm();
  showWelcomeMessage();
  loadFormData();
  document.addEventListener("keyup", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "m") {
      autofillFormWithTestData();
    }
  });

  // 1: Handle form submission when user clicks "Beställ"
  form.addEventListener("submit", handleCheckout);

  document.getElementById("closeModal").onclick = closeModal;
  document.getElementById("goToIndex").onclick = closeModal;
}

function renderCheckoutForm() {
  const { cart, products, subtotal, total, moms } = getAggregatedCart();
  console.log({ cart, products, subtotal, total, moms });

  for (const product of products) {
    miniCartContainer.innerHTML += `
            <div class="product">
                <h4>${product.name}</h4>
                <div class="product-numbers">
                  <p>${product.price.toFixed(2)}:-</p>
                  <p>x${product.quantity}</p>
                  <p style="font-weight: 900">= ${product.total.toFixed(
                    2
                  )}:-</p>
                </div>
              </div>
        `;
  }

  miniCartContainer.innerHTML += `
      <br>
        <div class="total-amount">
          <p>
            <strong>= total</strong>:
            ${total.toFixed(2)}:-
          </p>
          <p style="font-size: 0.8em">
            <strong>varav moms</strong>:
            ${moms.toFixed(2)}:-
          </p>
        </div>
      <br>
    `;
}

function autofillFormWithTestData() {
  form.firstName.value = "Doug";
  form.lastName.value = "Alcedo";
  form.email.value = "dougalcedo@gmail.com";
  form.streetAddress.value = "Älgvägen 18";
  form.city.value = "Upplands Väsby";
  form.postcode.value = "11112";
  form.phoneNumber.value = "077 321 06 04";
}

function disableOrderButton() {
  orderBtn.disabled = true;
}

function enableOrderButton() {
  orderBtn.disabled = false;
}

async function handleCheckout(e) {
  e.preventDefault();
  disableOrderButton();
  // reset error
  displayError();
  console.log(" Form submitted — ready to process order");

  // 2: Validate the required fields before sending the request
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "streetAddress",
    "city",
    "postcode",
    "phoneNumber",
  ];

  const fieldLabels = {
    firstName: "Förnamn",
    lastName: "Efternamn",
    email: "Email",
    streetAddress: "Gatuadress",
    city: "Postort",
    postcode: "Postnummer",
    phoneNumber: "Telefonnummer",
  };

  for (const name of requiredFields) {
    const value = form[name].value.trim();
    if (!value) {
      displayError(`Vänligen fyll i ${fieldLabels[name]}`);
      enableOrderButton();
      return;
    }
  }
  // 3: Ensure the cart is not empty
  // as the restrictions are already there empty cart will not open but we double-check here for safety in case localStorage was cleared or corrupted
  const { products } = getAggregatedCart();

  if (!products || products.length === 0) {
    displayError(
      "Din varukorg är tom. Lägg till produkter innan du beställer."
    ); // "Your cart is empty"
    toggleOrderButton(trure);
    return;
  }

  // 4A: Extract the User id (if logged in)
  localStorage.getItem("hakim-livs-token");

  // 4B: Build the request payload and include the user id if available
  const userId = globalThis.user?._id; // extract user ID from token

  const body = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    phoneNumber: form.phoneNumber.value.trim(),
    address: `${form.streetAddress.value.trim()} ${form.city.value.trim()} ${form.postcode.value.trim()}`,
    products: products.map((p) => ({
      productId: p._id,
      quantity: p.quantity,
    })),
  };

  // Optionally add the user field if logged in
  if (userId) {
    body.user = userId;
  }

  console.log("Final payload to send:", body);

  // 5: Send the POST request and handle success or failure

  try {
    const res = await fetch(
      "https://webshop-2025-be-g1-blush.vercel.app/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Något gick fel vid beställningen."); // “Something went wrong”
    }

    const result = await res.json();
    console.log("Order created successfully:", result);

    saveFormData(form);

    // Show the order confirmation modal
    document.getElementById("orderNumber").textContent = result.orderID;
    document.getElementById("userEmail").textContent = form.email.value.trim();
    document.getElementById("orderConfirmationModal").style.display = "block";

    // Clear the cart visually and in localStorage
    // prevent it from showing again when the user goes back to the cart
    localStorage.setItem("hakim-livs-cart", JSON.stringify([]));
    updateDOMWithCartData(); // This updates cart icon etc.
  } catch (err) {
    console.error(" Error placing order:", err.message);
    enableOrderButton();
    displayError("Kunde inte skicka beställningen. Försök igen.");
  }
}

function loadFormData() {
  try {
    const previous = JSON.parse(localStorage.getItem("hakim-previous-form"));
    if (!previous) return;
    form.streetAddress.value = previous.streetAddress;
    form.city.value = previous.city;
    form.postcode.value = previous.postcode;
    form.phoneNumber.value = previous.phoneNumber;
  } catch (error) {
    console.log(error);
  }
}

function saveFormData(form) {
  localStorage.setItem(
    "hakim-previous-form",
    JSON.stringify(Object.fromEntries(new FormData(form)))
  );
}

// Function to close the confirmation modal window
function closeModal() {
  document.getElementById("orderConfirmationModal").style.display = "none";
  window.location.href = "index.html"; // Redirect to index page
}
