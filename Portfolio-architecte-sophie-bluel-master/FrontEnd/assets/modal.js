// 🔹 TABLE DES MATIÈRES
// 1. Sélection des éléments HTML
// 2. Ouverture / fermeture de la modale
// 3. Navigation entre les vues (galerie / ajout photo)
// 4. Affichage de la galerie dans la modale
// 5. Prévisualisation image
// 6. Validation dynamique du formulaire
// 7. Soumission du formulaire (POST)
// 8. Réinitialisation du formulaire
// 9. Suppression d'une image (DELETE)
// 10. Chargement des catégories dans <select>


// =====================================
// 1. SÉLECTION DES ÉLÉMENTS HTML
// =====================================

// sélection des éléments de la modale

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalGallery = document.getElementById('modal-gallery');
const modalAddPhoto = document.getElementById('modal-add-photo');
const openAddPhotoBtn = document.getElementById('open-add-photo');
const backToGalleryBtn = document.querySelector('.back-to-gallery');

// image preview et formulaire

const fileInput = document.getElementById('photo-upload');
const previewImg = document.getElementById('image-preview');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const validateBtn = document.querySelector('.validate-btn');
const addPhotoForm = document.getElementById('add-photo-form');

// =====================================
// 2. OUVERTURE / FERMETURE DE LA MODALE
// =====================================

// Ouvre la modale au clic sur le bouton

if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden'); // Affiche la modale
    displayModalGallery(window.works); // Affiche la galerie dans la modale
  });

  // Fermer la modale via la croix
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Fermer le modal en cliquant à l'extérieur
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// ============================
// 3. NAVIGATION ENTRE LES DEUX VUES
// ============================

// bascule entre modale

    // Ouvre la modal "ajout photo"
if (openAddPhotoBtn) {
  openAddPhotoBtn.addEventListener('click', () => {
    modalGallery.classList.add('hidden'); // Cache la galerie
    modalAddPhoto.classList.remove('hidden'); // Affiche la vue ajout photo

    resetAddPhotoForm(); // Réinitialise le formulaire d'ajout photo
    populateCategorySelect(); // Remplit le select des catégories
  });
}

    // Retour à la modal galerie
if (backToGalleryBtn) {
  backToGalleryBtn.addEventListener('click', () => {
    modalAddPhoto.classList.add('hidden');
    modalGallery.classList.remove('hidden');
  });
}

// ============================
// 4. AFFICHAGE DE LA GALERIE DANS LA MODALE
// ============================

function displayModalGallery(works) {
  const galleryModal = document.querySelector ('.gallery-modal');
  galleryModal.innerHTML = ''; // Vide la galerie avant de l'afficher

  works.forEach(work => {
    const figure = document.createElement ('figure');
    figure.classList.add('modal-figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement ('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    figure.dataset.id = work.id;

    // Suppression avec confirmation
    deleteBtn.addEventListener('click', () => {
      const workId = deleteBtn.dataset.id
      const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette photo ?');
      if (confirmDelete) {
        deleteWork(work.id); // Appel de la fonction de suppression
      }
    });    

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    galleryModal.appendChild(figure);
  });
}

// ============================
// 5. PRÉVISUALISATION IMAGE AVANT ENVOI
// ============================

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.style.display = 'block';
    // Cache le bloc "ajouter photo"
    document.querySelector('.upload-label').style.display = 'none';
  };
  reader.readAsDataURL(file);

  // Active ou désactive le bouton Valider
  checkFormValidity();
});

  // Met à jour le bouton valider quand le titre ou la catégorie changent
titleInput.addEventListener('input', checkFormValidity);
categorySelect.addEventListener('change', checkFormValidity);

// ============================
// 6. VALIDATION AUTOMATIQUE DU FORMULAIRE
// ============================

function checkFormValidity() {
  const isReady = // Vérifie si les 3 chgamps sont remplis
    fileInput.files.length > 0 && // il faut un fichier sélectionné
    titleInput.value.trim() !== '' && // le titre ne doit pas être vide
    categorySelect.value !== ''; // la catégorie doit être sélectionnée (non vide)

  if (isReady) { // si tous les champs sont valides = bouton actif
    validateBtn.disabled = false;
    validateBtn.classList.add('active');
  } else {
    validateBtn.disabled = true;
    validateBtn.classList.remove('active');
  }
}

// ============================
// 7. ENVOI DU FORMULAIRE (AJOUT DE PHOTO)
// ============================

addPhotoForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  //récupération des données du formulaire
  const file = fileInput.files[0]; //image
  const title = titleInput.value; //titre
  const category = categorySelect.value; //catégorie

  // vérifie que tous les champs sont remplis
  if (!file || !title || !category) {
    alert('Veuillez remplir tous les champs du formulaire.');
    return;
  }

  // Création de l'objet FormData pour envoyer les données
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('category', category);

  // Récupération du token d'authentification
  const token = sessionStorage.getItem('token');

  try {
    // Envoi a l'API avec fetch
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // authentification
      },
      body: formData
    });

  // si la réponse est ok, on traite les données
    if (response.ok) {
      const newWork = await response.json(); // Données retournée par l'API

      // Ajoute le nouveau travail à la liste globale
      window.works.push(newWork);
      if (typeof works !== 'undefined') {
        works = window.works;
      }

      // Met à jour les galeries
      displayModalGallery(window.works);
      if (typeof displayWorks === 'function') {
        displayWorks(0); // Affiche tous les travaux dans la galerie principale
      }

      // Réinitialise le formulaire
      resetAddPhotoForm();

      // retourne à la galerie dans la modale
      modalAddPhoto.classList.add('hidden');
      modalGallery.classList.remove('hidden');

    } else {
      console.error('Erreur lors de l\'envoi du formulaire :', response.status);
      alert('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
    }

  } catch (error) {
    console.error('Erreur réseau:', error);
    alert("Impossible d'ajouter l'image. Problème de connexion.");
  }
});

// ============================
// 8. REMISE À ZÉRO DU FORMULAIRE
// ============================

function resetAddPhotoForm() {
  const form = document.getElementById('add-photo-form');
  form.reset(); // Vide tous les champs input/select

  // Réinitialise l’image
  const previewImg = document.getElementById('image-preview');
  previewImg.src = '';
  previewImg.style.display = 'none';

  // Réaffiche la zone "Ajouter photo"
  document.querySelector('.upload-label').style.display = 'flex';
  document.querySelector('.upload-preview p').style.display = 'block';

  // Désactive le bouton valider
  const validateBtn = document.querySelector('.validate-btn');
  validateBtn.disabled = true;
  validateBtn.classList.remove('active');
}

// ============================
// 9. SUPPRESSION D’UNE PHOTO
// ============================

async function deleteWork(id) {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
  });

    if (response.ok) {
      // Supprimer du DOM l'image supprimée
      const figureToDelete = document.querySelector(`[data-id="${id}"]`);
      if (figureToDelete) {
        figureToDelete.remove();
      }

      // Recharger les travaux à jour
      window.works = window.works.filter(work => work.id !== parseInt(id));

      // Afficher tous les travaux après suppression
      if (typeof works !== 'undefined') {
        works = window.works;
      }

      // Mise à jour galerie principale
      if (typeof displayWorks === 'function') {
        displayWorks(0);
      }

      // Afficher la galerie modale mise à jour
      displayModalGallery(window.works); 

    } else {
      console.error('Erreur lors de la suppression :', response.status);
    }
  } catch (error) {
    console.error('Erreur de la requête DELETE :', error);
  }
}

// ============================
// 10. CHARGEMENT DES CATÉGORIES DANS LE <SELECT>
// ============================

function populateCategorySelect() {
  fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((categories) => {
      categorySelect.innerHTML = '';

      // Ajoute une option vide par défaut
      const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        emptyOption.disabled = true;
        emptyOption.selected = true;
        categorySelect.appendChild(emptyOption);

      // Ajoute les options pour chaque catégorie
      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des catégories :', error);
    });
}

window.resetAddPhotoForm = resetAddPhotoForm;