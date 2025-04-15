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
}
