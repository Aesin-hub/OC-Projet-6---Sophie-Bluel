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

// Gestion ouverture et fermeture de la modale

if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    displayModalGallery(window.works); // Affiche la galerie dans la modale
  });

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

// bascule entre modale

if (openAddPhotoBtn) {
  openAddPhotoBtn.addEventListener('click', () => {
    modalGallery.classList.add('hidden');
    modalAddPhoto.classList.remove('hidden');
  });
}

if (backToGalleryBtn) {
  backToGalleryBtn.addEventListener('click', () => {
    modalAddPhoto.classList.add('hidden');
    modalGallery.classList.remove('hidden');
  });
}

// Affichage galerie dans la modale

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

    deleteBtn.addEventListener('click', () => deleteWork(work.id));

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    galleryModal.appendChild(figure);
  });
}

// Gestion de la préview  de l'image

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.style.display = 'block';
    document.querySelector('.upload-label').style.display = 'none';
  };
  reader.readAsDataURL(file);

  checkFormValidity();
});

titleInput.addEventListener('input', checkFormValidity);
categorySelect.addEventListener('change', checkFormValidity);

// Vérifie si le formulaire est complet

function checkFormValidity() {
  const isReady =
    fileInput.files.length > 0 &&
    titleInput.value.trim() !== '' &&
    categorySelect.value !== '';

  if (isReady) {
    validateBtn.disabled = false;
    validateBtn.classList.add('active');
  } else {
    validateBtn.disabled = true;
    validateBtn.classList.remove('active');
  }
}

// Réinitialise tous les champs de formulaire

function resetAddPhotoForm() {
  const form = document.getElementById('add-photo-form');
  form.reset();

  previewImg.src = '';
  previewImg.style.display = 'none';
  document.querySelector('.upload-label').style.display = 'flex';
}

function populateCategorySelect() {
  fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((categories) => {
      categorySelect.innerHTML = '';
      const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = ''; // ou "— Choisir une catégorie —" si tu veux un faux placeholder
        emptyOption.disabled = true;
        emptyOption.selected = true;
        categorySelect.appendChild(emptyOption);
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

populateCategorySelect();
