// CREATION DE LA MODALE
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function(e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute ("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(":focus");
  modal.style.display= "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}

const closeModal = function(e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) {
    previouslyFocusedElement.focus();
  }
  e.preventDefault();
  modal.style.display= "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  modal = null;
}

const stopPropagation = function(e) {
  e.stopPropagation();
}

const focusInModal = function (e) {
  e.preventDefault();
  //console.log(focusables);
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  };
  if (index >= focusables.length) {
    index = 0;
  };
  if (index < 0) {
    index = focusables.length - 1;
  };
  focusables[index].focus();
}

document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal);
})

window.addEventListener("keydown", function(e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  };
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  };
})

// Charger la galerie à éditer
async function displayEditWorks(works){
  const editGallery = document.querySelector(".edit-gallery");
  editGallery.innerHTML = "";
  works.forEach(work => {
    // Récupération de l'élément du DOM qui accueillera les fiches
    // Création d’une balise dédiée à une fiche
    const editWork = document.createElement("figure");
    let id = work.id;
    editWork.setAttribute("id", id);    
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.classList.add("thumbnail");
    const bin = document.createElement("button");
    bin.classList.add("delete");
    bin.innerHTML = `<i class="fa-regular fa-trash-can fa-xs"></i>`;
    bin.addEventListener("click", function(e) {
      e.preventDefault();
      deleteWorks(id, userAuth);
    })
    const move = document.createElement("button");
    move.classList.add("move");
    move.innerHTML = `<i class="fa-solid fa-up-down-left-right fa-xs"></i>`;
    const editLink = document.createElement("a");
    editLink.innerText = "éditer";
    editLink.setAttribute("href", "#");
    // On rattache la balise figure au div gallery 
    editGallery.appendChild(editWork);
    editWork.appendChild(imageElement);
    editWork.appendChild(bin);
    editWork.appendChild(move);
    editWork.appendChild(editLink);
  });
};


function deleteWorks(id, userAuth) {
  // console.log(id);
  // console.log(userAuth);
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${userAuth}`
      }   
  })
  .then ((response) => {
    if (response.ok) { 
      works = works.filter(work => work.id!==id);
      displayEditWorks(works);
      generateWorks(works);
    } else {
        throw new Error("Erreur");
    }
  })
  .catch((e) => console.log(e));
};




async function addWorks(userAuth) {
  const formAddWorks = document.querySelector(".btn-add");
  formAddWorks.addEventListener("click", createFormAdd())
  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${userAuth}`,
      "accept": "application/json"
      //"Content-Type": "multipart/form-data"
      }   
  })
}

async function createFormAdd() {

}