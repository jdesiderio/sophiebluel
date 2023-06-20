/* const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();
console.log(works);*/

// Récupération des fiches
fetch('http://localhost:5678/api/works', { method: 'GET' })
  .then((response) => response.json())
  .then((json) => { 
    let works = json;

    // Générer le portfolio
    function generateWorks(works){
      for (let i = 0; i < works.length; i++) {
          const figure = works[i];
          // Récupération de l'élément du DOM qui accueillera les fiches
          const gallery = document.querySelector(".gallery");
          // Création d’une balise dédiée à une fiche
          const workElement = document.createElement("figure");
          // Création des balises 
          const imageElement = document.createElement("img");
          imageElement.src = figure.imageUrl;
          const titleElement = document.createElement("figcaption");
          titleElement.innerText = figure.title;
          
          // On rattache la balise figure au div gallery 
          gallery.appendChild(workElement);
          workElement.appendChild(imageElement);
          workElement.appendChild(titleElement);
       }
    };
    generateWorks(works);

    // Création des boutons de filtres
    const category = works.map(works => works.category);
    console.log(category);
    // récupérer les catégories uniques
    const distinctCat = [];
    const map = new Map();
    for (const item of category) {
        if(!map.has(item.id)){
            map.set(item.id, true);
            distinctCat.push({
                id: item.id,
                name: item.name
            });
        }
    };
    console.log(distinctCat);
    
    // générer les boutons de filtres
    function generateBtns(distinctCat) {
      const filters = document.querySelector(".filters");
      const btnElementAll = document.createElement("button");
      btnElementAll.classList.add("button");
      btnElementAll.setAttribute("id", "0");
      btnElementAll.innerText = "Tous";
      filters.appendChild(btnElementAll);

      for (let j = 0; j < distinctCat.length; j++) {
      const btn = distinctCat[j];
      const btnElement = document.createElement("button");
      btnElement.classList.add("button");
      btnElement.setAttribute("id", j+1);
      btnElement.innerText = btn.name;
      filters.appendChild(btnElement);
      };
    };
    generateBtns(distinctCat);

// Ajout du listener pour filtrer les pièces non abordables
/*const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
   const piecesFiltrees = pieces.filter(function (piece) {
       return piece.disponibilite;
   });
   // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});*/

  // Ajout du listener sur chaque bouton filtre
  let filterBtn = document.querySelectorAll(".button");
  for (let j = 0; j < filterBtn.length; j++) {
    filterBtn[j].addEventListener("click", filterWorks);
    //console.log(filterBtn[j]);
  }

  // fonction pour filtrer
  function filterWorks(event) {
    const btnId = parseInt(event.target.id);
    console.log(btnId);
    let filteredWorks;
  
    if (btnId === 0) {
      // Cliquer Bouton "Tous" > afficher tous les éléments
      filteredWorks = works;
    } else {
      // Filtrer les éléments en fonction de l'ID de la catégorie du bouton cliqué
      filteredWorks = works.filter(work => work.category.id === btnId);
    };
      console.log(filteredWorks);
         // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
      document.querySelector(".gallery").innerHTML = "";
      generateWorks(filteredWorks);
  };

})