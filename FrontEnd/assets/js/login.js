// listener sur le formulaire
const formLogin = document.querySelector(".form-login");
formLogin.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Récupérer les données du formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await sendLoginRequest(email, password);
});

// pour les erreurs
let errorDisplayed = false;

// Fonction POST des données utilisateurs
async function sendLoginRequest(email, password) {
  const userData = {
    email: email,
    password: password
  };
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const responseData = await response.json();
      sessionStorage.setItem("savedToken", responseData.token);
      window.location.href = "index.html";
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    //console.error(error);
    if (!errorDisplayed) { 
      errorMessage();
      errorDisplayed = true;
    }
  }
}

function errorMessage() {
  const errorDiv = document.querySelector(".div-error");
  const errorElement = document.createElement("p");
  errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";
  errorDiv.appendChild(errorElement);
}
