
const formLogin = document.querySelector(".form-login");
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  // Création de l’objet utilisateur
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  sendLoginRequest(email, password);
});


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
      sessionStorage.setItem("saveToken", responseData.token);
  })
  .catch(error => {
    console.error(error);
    errorMessage();
  });
}

function errorMessage() {
  const errorDiv = document.querySelector(".div-error");
  const errorElement = document.createElement("p");
  errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";
  errorDiv.appendChild(errorElement);

  // Effacement de l'écran et regénération de la page
}
  
