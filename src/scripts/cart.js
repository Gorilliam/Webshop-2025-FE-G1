import loadUserContext from "../utils/userContext.js";
import { showWelcomeMessage } from "../utils/api.js";
import { updateDOMWithCartData, renderCart } from "../utils/cartFunctions.js";
import loadHeader from "./header.js";

cart()

async function cart() {
  await loadUserContext()
  await loadHeader()
  updateDOMWithCartData();
  renderCart();
  showWelcomeMessage()
  if (!globalThis.loggedIn) {
    const loggedOutDiv = document.querySelector("#loggedOut")
    loggedOutDiv.innerHTML = `
      <h4>Du är inte inloggad</h4>
      <a href="/login.html">Klicka här</a> för att logga in eller skapa ett konto.
    `
  }
}
