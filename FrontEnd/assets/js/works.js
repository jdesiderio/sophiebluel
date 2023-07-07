const root = "http://localhost:5678/api/";

// Récupération des fiches
function loadWorks() {
  fetch(root + "works", { method: 'GET' })
  .then((response) => response.json())
  .then((json) => { 
    works = json;
    // console.log(works);
    generateWorks(works);
    displayEditWorks(works);
  });
};
loadWorks();

//Récupération des catégories pour les filtres
function loadCat() {
  fetch(root + "categories", { method: 'GET' })
  .then((response) => response.json())
  .then((json) => { 
    categories = json;
    //console.log(categories);
    generateBtns(categories);

    // Ajout du listener sur chaque bouton filtre
    let filterBtn = document.querySelectorAll(".filter-btn");
    filterBtn.forEach(btn => {
      btn.addEventListener("click", filterWorks);
    });
    //console.log(filterBtn);
  });
};
loadCat();

// Générer les fiches du portfolio
async function generateWorks(works){
  works.forEach(work => {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const gallery = document.querySelector(".gallery");
    // Création d’une balise dédiée à une fiche
    const workElement = document.createElement("figure");
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;
    // On rattache la balise figure au div gallery 
    gallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
  });
};

const userAuth = sessionStorage.getItem("savedToken");
if (userAuth)  {
  // Créer la barre admin
  const body = document.querySelector("body");
  const adminMenu = document.createElement("div");
  adminMenu.innerHTML=`<div class="edition">
                        <i class="fa-regular fa-pen-to-square"></i>
                        <p class="edition-p">Mode édition</p>
                      </div>
                      <button class="edition-btn">Publier les changements</button>`;
  adminMenu.classList.add("admin-menu");
  body.prepend(adminMenu);

  // Ajouter les boutons "modifier"
  const intro = document.querySelector("#introduction figure");
  const modifyIntro = document.createElement("div");
  modifyIntro.classList.add("modify");
  modifyIntro.innerHTML = `<a href="#">
                        <i class="fa-regular fa-pen-to-square"></i>
                        modifier
                      </a>`;
  intro.append(modifyIntro);
  const projects = document.querySelector(".port-title");
  const modifyProj = document.createElement("div");
  modifyProj.innerHTML = `<a href="#modalProj" class="js-modal">
                            <i class="fa-regular fa-pen-to-square"></i>
                            modifier
                          </a>`;
  projects.append(modifyProj);

  //cacher le div filtres 
 document.querySelector(".filters").classList.add("hidden");

  // logout / login
  const log = document.querySelector(".log");
  log.innerText = "logout";
  if (log) {
    log.addEventListener("click", function(e) {
      //e.preventDefault();
      sessionStorage.removeItem("savedToken");
      log.innerText= "login";
      //window.location.href = "index.html";
      document.querySelector(".admin-menu").classList.add("hidden");
      document.querySelector(".modify").classList.add("hidden");
      document.querySelector(".port-title div").classList.add("hidden");
      document.querySelector(".filters").classList.remove("hidden");
    });
  }
}

/*const logout = document.querySelector(".log");
if (logout) {
  logout.addEventListener("click", function(e) {
    e.preventDefault();
    window.sessionStorage.removeItem("savedToken");
    logout.innerText= "login";
    document.querySelector(".admin-menu").classList.add("hidden");
    document.querySelector(".modify").classList.add("hidden");
    document.querySelector(".port-title div").classList.add("hidden");
    document.querySelector(".filters").classList.remove("hidden");
  });
}*/





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