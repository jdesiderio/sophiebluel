
// listener sur le formulaire
const formLogin = document.querySelector(".form-login");
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  sendLoginRequest(email, password);
});

// pour les erreurs
let errorDisplayed = false;

// Fonction POST des données utilisateurs
function sendLoginRequest(email, password) {
  const userData = {
    email: email,
    password: password
  };
  fetch("http://localhost:5678/api/users/login", 
  { method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status + ' ' + response.statusText);
    }
  })
  .then(responseData => {
      console.log(responseData.token);
      sessionStorage.setItem("savedToken", responseData.token);
      errorDisplayed = false;
      window.location.href = "index.html";
      pageEdit();
    })
    .catch(error => {
      console.error(error);
      if (!errorDisplayed) { 
        errorMessage();
        errorDisplayed = true;
      }
  });
}

function errorMessage() {
  const errorDiv = document.querySelector(".div-error");
  const errorElement = document.createElement("p");
  errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";
  errorDiv.appendChild(errorElement);
}

/* function pageEdit() {
  const log = document.querySelector(".log");
  log.innerText = "logout";
  log.href = "login.html";
  log.addEventListener("click", logoutUser); 
}

function logoutUser() {
  sessionStorage.removeItem("savedToken");
  window.location.href = "login.html";
}


// Vérifier si l'utilisateur est connecté
function checkUserAuthentication() {
  const savedToken = sessionStorage.getItem("savedToken");
  if (savedToken) {
    // Utilisateur connecté, autoriser l'accès à la page sécurisée
    pageEdit();
  } else {
    // Rediriger vers la page de connexion
    window.location.href = "login.html";
  }
}

// Appeler la fonction de vérification de l'authentification sur les pages pertinentes
if (window.location.pathname === "/index.html" || window.location.pathname === "/login.html") {
  checkUserAuthentication();
}*/