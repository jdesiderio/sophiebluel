// Récupérer tous les liens du menu
var menuLinks = document.querySelectorAll("nav li a");

// Parcourir tous les liens
menuLinks.forEach(menuLink => {
  // Vérifier si l'URL du lien correspond à l'URL de la page en cours
  if (menuLink.href === window.location.href) {
    menuLink.classList.add("current");
  }
  
  // Ajouter un écouteur d'événement au clic (pour ancres et autres)
  menuLink.addEventListener("click", function() {
    // Supprimer la classe active de tous les liens
    menuLinks.forEach(link => {
      link.classList.remove("current");
    });
    // Ajouter la classe active au lien cliqué
    this.classList.add("current");
  });
});