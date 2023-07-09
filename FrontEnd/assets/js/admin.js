function getToken() {
  return sessionStorage.getItem("savedToken");
}  

function createAdminPage() {
  const token = getToken();
  if (token) {
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
        sessionStorage.removeItem("savedToken");
        log.innerText= "login";
        document.querySelector(".admin-menu").classList.add("hidden");
        document.querySelector(".modify").classList.add("hidden");
        document.querySelector(".port-title div").classList.add("hidden");
        document.querySelector(".filters").classList.remove("hidden");
      });
    }
  }
};
createAdminPage();

async function deleteWorks(id, modalContent) {
  const token = getToken();
  if (!token) {
    // Gérer le cas où le token n'est pas disponible
    console.log("Token non disponible");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      works = works.filter(work => work.id !== id);
      generateWorks(works);
      //modalContent.innerHTML = "";
      generateEditWorks(works);
    } else {
      throw new Error("Erreur");
    }
  } catch (error) {
    //console.log(error);
  }
}


//Créer le formulaire d'ajout d'items dans la galerie
async function createFormAdd(modalContent, categories) {
  // Vide la page en supprimant tous les éléments du body
  modalContent.innerHTML = "";

  //Créer les boutons de retour
  const returnBtn = document.createElement("button");
  returnBtn.classList.add("modal-return");
  const returnMark = document.createElement("i");
  returnMark.classList.add("fa-solid", "fa-arrow-left", "fa-xl");
  returnBtn.appendChild(returnMark);
  returnBtn.addEventListener("click", function() 
    {
      modalContent.innerHTML = "";
      generateEditWorks(works)
    });

  // Crée un form
  const title = document.createElement("h3");
  title.innerText = "Ajout photo";
  const form = document.createElement("form");
  form.classList.add("add-form");
  form.setAttribute("action", "#");
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "multipart/form-data");

  const imgLabel = document.createElement("label");
  imgLabel.classList.add("img-label");
  const imgIcon = document.createElement("i");
  imgIcon.classList.add("fa-regular", "fa-image");
  const imgInput = document.createElement("input");
  imgInput.type = "file";
  imgInput.name = "image";
  imgInput.setAttribute("accept", "image/png, image/jpeg");
  const imgBtn = document.createElement("p");
  imgBtn.classList.add("add-pic-btn");
  imgBtn.innerText = "+ Ajouter photo";
  const imgText = document.createElement("p");
  imgText.innerText = "jpg, png : 4mo max";
  imgText.classList.add("pic-info");
  
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.innerText = "Titre";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";

  const catLabel = document.createElement("label");
  catLabel.setAttribute("for", "category");
  catLabel.innerText = "Catégorie";
  const categorySelect = document.createElement("select");
  categorySelect.name = "category";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const line = document.createElement("div");
  
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.innerText = "valider";
  submitBtn.classList.add("btn", "submit-btn");

  // Ajoute le formulaire à la page
  imgLabel.appendChild(imgIcon);
  imgLabel.appendChild(imgInput);
  imgLabel.appendChild(imgBtn);
  imgLabel.appendChild(imgText);
  form.appendChild(imgLabel);
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(catLabel);
  form.appendChild(categorySelect);
  form.appendChild(line);
  form.appendChild(submitBtn);
  modalContent.appendChild(returnBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  
  imgInput.addEventListener("change", function(e) {
    checkImgSize(e, imgLabel);
  });
  form.addEventListener("submit", function(e) {
    sendFormData(e, imgInput, modalContent);
  });
}

async function sendFormData(e, imgInput, modalContent) {
  e.preventDefault();

  const token = getToken();
  const imgResult = imgInput;
  //console.log(imgResult);
  const title = document.querySelector("input[name='title']").value;
  const categorySelect = document.querySelector("select[name='category']");
  const catId = categorySelect.options[categorySelect.selectedIndex].value;

  if (!imgResult.files || imgResult.files.length === 0) {
    alert("Aucun fichier sélectionné");
    return;
  }

  if (!title) {
    alert("Veuillez entrer un titre");
    return;
  }

  if (!catId) {
    alert("Veuillez sélectionner une catégorie");
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('image', imgResult.files[0]);
  formData.append('category', catId);
  
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "accept": "application/json"
      },
      body: formData
    });

    if (response.ok) {
      const newWork = await response.json();
      works.push(newWork);
      generateWorks(works);
      modalContent.innerHTML = "";
      generateEditWorks(works);

      e.target.reset();
    } else {
      console.log("Une erreur s'est produite lors de l'ajout de l'élément dans la galerie.");
    }
  } catch (error) {
    console.log("Une erreur s'est produite lors de la communication avec le serveur.", error);
  }
}


function checkImgSize(e, imgLabel) {
  const file = e.target.files[0]; // Récupère le fichier sélectionné
  if (file.size > 4 * 1024 * 1024) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    // Réinitialise la valeur de l'input pour permettre à l'utilisateur de sélectionner à nouveau un fichier
    e.target.value = "";
  } else {
      // La taille du fichier est valide, vous pouvez effectuer d'autres opérations si nécessaire
      const imgPreview = document.createElement("img");
      imgPreview.classList.add("preview-img");
      imgPreview.src = URL.createObjectURL(file);

      // Remplace les éléments dans imgLabel par l'image prévisualisée
      imgLabel.innerHTML = "";
      imgLabel.appendChild(imgPreview);
    }
}