const root = "http://localhost:5678/api/";

async function loadWorks() {
  try {
    const response = await fetch(root + "works", { method: "GET" });
    const json = await response.json();
    
    works = json;
    generateWorks(works);
    generateEditWorks(works);
  } catch (error) {
    console.log("Une erreur s'est produite lors du chargement des fiches.", error);
  }
}
loadWorks();

//Récupération des catégories
async function loadCat() {
  try {
    const response = await fetch(root + "categories", { method: "GET" });
    const json = await response.json();
    categories = json;
    //console.log(categories);
    generateBtns(categories);

    // Ajout du listener sur chaque bouton filtre
    let filterBtn = document.querySelectorAll(".filter-btn");
    filterBtn.forEach(btn => {
      btn.addEventListener("click", filterWorks);
    });
    //console.log(filterBtn);
  } catch (error) {
    console.log("Une erreur s'est produite lors du chargement des catégories.", error);
  }
}
loadCat();

// Générer la galerie (principale et edition)
function generateWorks(works, isEditable = false) {
  const gallerySelector = isEditable ? ".edit-gallery" : ".gallery";
  const gallery = document.querySelector(gallerySelector);
  gallery.innerHTML = "";

  works.forEach(work => {
    const workElement = document.createElement("figure");
    
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.setAttribute("id", `img${work.id}`);
    
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;

    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);

    if (isEditable) {
      imageElement.classList.add("thumbnail");
      titleElement.innerText = null;

      const bin = document.createElement("button");
      bin.classList.add("delete");
      bin.innerHTML = `<i class="fa-regular fa-trash-can fa-xs"></i>`;
      bin.addEventListener("click", function(e) {
        e.preventDefault();
        deleteWorks(work.id);
      });

      const move = document.createElement("button");
      move.classList.add("move");
      move.innerHTML = `<i class="fa-solid fa-up-down-left-right fa-xs"></i>`;
      
      const editLink = document.createElement("a");
      editLink.innerText = "éditer";
      editLink.setAttribute("href", "#");

      workElement.appendChild(bin);
      workElement.appendChild(move);
      workElement.appendChild(editLink);
    }

    gallery.appendChild(workElement);
  });
}

// Générer la modale contenant la galerie d'édition 
function generateEditWorks(works) {
  const modalContent = document.querySelector(".modal-wrapper");
  modalContent.innerHTML = "";

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("js-modal-close");
  const closeMark = document.createElement("i");
  closeMark.classList.add("fa-solid", "fa-xmark", "fa-xl");
  closeBtn.appendChild(closeMark);
  closeBtn.addEventListener("click", closeModal);

  const title = document.createElement("h3");
  title.innerText = "Galerie photo";
  
  const editGallery = document.createElement("div");
  editGallery.classList.add("edit-gallery");
  
  const btnAdd = document.createElement("button");
  btnAdd.classList.add("btn", "btn-add");
  btnAdd.innerText = "Ajouter une photo";

  btnAdd.addEventListener("click", function() {
    createFormAdd(modalContent, categories);
  });
  
  const btnDel = document.createElement("button");
  btnDel.classList.add("btn-delete");
  btnDel.innerHTML = "Supprimer la galerie";

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(editGallery);
  modalContent.appendChild(btnAdd);
  modalContent.appendChild(btnDel);

  generateWorks(works, true);
}


// générer les boutons de filtres
function generateBtns(categories) {
  const filters = document.querySelector(".filters");
  const btnElementAll = document.createElement("button");
  btnElementAll.classList.add("filter-btn", "btn");
  btnElementAll.innerText = "Tous";
  filters.appendChild(btnElementAll);

  for (let j = 0; j < categories.length; j++) {
  const btn = categories[j];
  const btnElement = document.createElement("button");
  btnElement.classList.add("filter-btn", "btn");
  btnElement.setAttribute("id", j+1);
  btnElement.innerText = btn.name;
  filters.appendChild(btnElement);
  }
}

// fonction pour filtrer
function filterWorks(e) {
  // Filtrer les éléments
  let filteredWorks = works.filter(work => e.target.id === "" || work.category.id === parseInt(e.target.id));
  //console.log(filteredWorks);
  
  // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(filteredWorks);
}