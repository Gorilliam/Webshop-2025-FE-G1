export function getBaseUrl() {
  // if (!window.location.href.includes('localhost')) {
  return "https://webshop-2025-be-g1-blush.vercel.app/";
  // }
  // return "http://localhost:3000/";
}

export async function fetchProducts(categoryName = null) {
  let endpoint = "api/products";
  if (categoryName) {
    endpoint += `?category=${encodeURIComponent(categoryName)}`;
  }

  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
  return [];
}

// Added function for fetching pre-existing categories from the database to use for functions in page-specific javascript-files
export async function fetchCategories(endpoint = "api/categories") {
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);

  if (response.ok) {
    return await response.json();
  }
  return [];
}

// global function for toggling admin-link's visibility on/off based on admin's login status from localStorage. moved out of index.js to here for global use
export function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

export function showWelcomeMessage() {
  const welcomeMsg = document.getElementById("welcomeMessage");

  if (globalThis.loggedIn && welcomeMsg) {
    welcomeMsg.innerText = `Inloggad som: ${globalThis.user.firstName} (${globalThis.user.email})`
  }
}

export function logOut() {
  localStorage.removeItem('hakim-livs-token')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('firstName')
  localStorage.removeItem('lastName')
  localStorage.removeItem('userEmail')
  window.location.reload()
}