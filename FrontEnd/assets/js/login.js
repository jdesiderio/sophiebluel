const userAuth = sessionStorage.getItem("savedToken");

// pour les erreurs
let errorDisplayed = false;

// listener sur le formulaire
const formLogin = document.querySelector(".form-login");
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  // Recupérer les données du form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  sendLoginRequest(email, password);
});

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
      throw new Error(response.statusText);
    }
  })
  .then(responseData => {
      console.log(responseData.token);
      sessionStorage.setItem("savedToken", responseData.token);
      //errorDisplayed = false;
      window.location.href = "index.html";
    })
    .catch(error => {
      //console.error(error);
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