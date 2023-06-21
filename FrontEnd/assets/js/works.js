/* const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();
console.log(works);*/

const root = "http://localhost:5678/api/";

// Récupération des fiches
function loadWorks() {
  fetch(root + "works", { method: 'GET' })
  .then((response) => response.json())
  .then((json) => { 
    works = json;
    // console.log(works);
    generateWorks(works);
  });
};
loadWorks();

// Générer les fiches du portfolio
function generateWorks(works){
  works.forEach(work => {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const gallery = document.querySelector(".gallery");
    // Création d’une balise dédiée à une fiche
    const workElement = document.createElement("figure");
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;
    // On rattache la balise figure au div gallery 
    gallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
  });
};

//Récupération des catégories pour les filtres
function loadCat() {
  fetch(root + "categories", { method: 'GET' })
  .then((response) => response.json())
  .then((json) => { 
    categories = json;
    //console.log(categories);
    generateBtns(categories);

    // Ajout du listener sur chaque bouton filtre
    let filterBtn = document.querySelectorAll(".button");
    filterBtn.forEach(btn => {
      btn.addEventListener("click", filterWorks);
    });
    //console.log(filterBtn);
  });
};
loadCat();

// générer les boutons de filtres
function generateBtns(categories) {
  const filters = document.querySelector(".filters");
  const btnElementAll = document.createElement("button");
  btnElementAll.classList.add("button");
  btnElementAll.innerText = "Tous";
  filters.appendChild(btnElementAll);

  for (let j = 0; j < categories.length; j++) {
  const btn = categories[j];
  const btnElement = document.createElement("button");
  btnElement.classList.add("button");
  btnElement.setAttribute("id", j+1);
  btnElement.innerText = btn.name;
  filters.appendChild(btnElement);
  };
};

// fonction pour filtrer
function filterWorks(event) {
  // Filtrer les éléments
  let filteredWorks = works.filter(work => event.target.id === "" || work.category.id === parseInt(event.target.id));
  //console.log(filteredWorks);
  
  // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(filteredWorks);
};