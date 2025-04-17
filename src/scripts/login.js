document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  const loginPopup = document.querySelector(".login-popup"); // Select the entire popup
  const errorMessage = document.querySelector(".error-message");

  // Close login form and navigate to index.html when cross is clicked
  closeBtn.addEventListener("click", () => {
    // Redirect to index.html
    window.location.href = "index.html";
    // Hide the login popup
    loginPopup.style.display = "none";
  });

  togglePassword.addEventListener("click", function () {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://webshop-2025-be-g1-blush.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-dev-api-key": "jonatan",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await response.text(); // Get the response as text

      console.log("Response Text:", text);

      if (!response.ok) {
        let data;
        try {
          data = JSON.parse(text); // Attempt to parse the text as JSON
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          // alert(`Inloggning misslyckades: ${response.statusText}`);
          console.log(`${response.statusText}`);
          return;
        }
        errorMessage.textContent = `Inloggning misslyckades: ${
          data.message || response.statusText
        }`;
        errorMessage.classList.add("showElement");
        console.log("Error Data:", data); // Log the error data for debugging

        // alert(
        //   `Inloggning misslyckades: ${data.message || response.statusText}`
        // );
        return;
      }

      const data = JSON.parse(text); // Now parse the text as JSON

      //   1: Store token in localStorage
      localStorage.setItem("hakim-livs-token", data.token);

      //  2: Fetch user info from /api/auth/me using the token
      const meResponse = await fetch(
        "https://webshop-2025-be-g1-blush.vercel.app/api/auth/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "hakim-livs-token": data.token,
          },
        }
      );

      if (!meResponse.ok) {
        console.error("Misslyckades att hämta användarinfo.");
        alert("Kunde inte hämta användarinformation.");
        return;
      }

      const meData = await meResponse.json();
      console.log("User Info:", meData);

      // 3: Store additional user data
      localStorage.setItem("userEmail", meData.email);
      localStorage.setItem("isAdmin", meData.isAdmin);
      localStorage.setItem("firstName", meData.firstName);
      localStorage.setItem("lastName", meData.lastName);

      // 4: Redirect to home
      window.location.href = "index.html";
    } catch (err) {
      console.error("Nätverksfel:", err);
      alert("Nätverksfel. Försök igen senare.");
    }
  });
});

// registeration form
document.addEventListener("DOMContentLoaded", () => {
  const closeBtns = document.querySelectorAll(".close");
  const loginPopup = document.getElementById("loginPopup");

  const createAccountBtn = document.getElementById("createAccountBtn");
  const backToLoginLink = document.getElementById("backToLogin");

  const toggleRegisterPassword = document.getElementById(
    "toggleRegisterPassword"
  );
  const registerPasswordField = document.getElementById("registerPassword");

  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );
  const confirmPasswordField = document.getElementById("confirmPassword");

  const loginFormWrapper = document.getElementById("loginFormWrapper");
  const registerFormWrapper = document.getElementById("registerFormWrapper");
  const greetingsContent = document.querySelector(".greetings-content");
  const modalContent = document.querySelector(".modal-content");

  // Close all popups
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });

  // Show registration form
  createAccountBtn.addEventListener("click", () => {
    loginFormWrapper.style.display = "none";
    registerFormWrapper.style.display = "block";
    greetingsContent.style.display = "none";
    modalContent.classList.add("signUp");
  });

  // Go back to login form
  backToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerFormWrapper.style.display = "none";
    loginFormWrapper.style.display = "flex";
    modalContent.classList.remove("signUp");
    greetingsContent.style.display = "flex";
  });

  // Toggle password visibility on register form
  toggleRegisterPassword.addEventListener("click", function () {
    const type =
      registerPasswordField.getAttribute("type") === "password"
        ? "text"
        : "password";
    registerPasswordField.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
  toggleConfirmPassword.addEventListener("click", function () {
    const type =
      confirmPasswordField.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordField.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
});

// Handle registration form submission
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("registerFirstName").value.trim();
  const lastName = document.getElementById("registerLastName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  //  1. Validate passwords match
  if (password !== confirmPassword) {
    alert("Lösenorden matchar inte. Försök igen.");
    return;
  }

  //  2. Send registration request to backend
  try {
    const response = await fetch(
      "https://webshop-2025-be-g1-blush.vercel.app/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-api-key": "jonatan",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      }
    );

    const data = await response.json(); // Get the response as JSON

    console.log(data);

    if (!response.ok) {
      alert(`Fel vid registrering: ${data.error || data.message || response.statusText}`);
      return;
    }

    //  3. On success, switch to login view
    // Store token in localStorage
    localStorage.setItem("hakim-livs-token", data.token); // Store the token here
    alert("Konto skapat! Du kan nu logga in.");
    registerForm.reset();
    document.getElementById("registerFormWrapper").style.display = "none";
    document.getElementById("loginFormWrapper").style.display = "block";
    document.querySelector(".greetings-content").style.display = "flex";
  } catch (error) {
    console.error("Nätverksfel:", error);
    alert("Ett nätverksfel uppstod. Försök igen senare.");
  }
});
