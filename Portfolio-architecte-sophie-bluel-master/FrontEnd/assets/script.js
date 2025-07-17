// déclarations des variables des données
// on récupere les éléments du DOM
// on recupere les works
// affichages des works
// on recupere les categories
// on creer les boutons de filtrage avec l'actions de filtrage

let works = [];

const gallery = document.querySelector('.gallery');
const filterButtons = document.querySelector('.filters');
const loginLink = document.getElementById('login-link');

// Fonction pour récupérer les works depuis l'API
const fetchWorks = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    works = await response.json();
    displayWorks(0);
  } catch (error) {
    console.error('Error fetching works:', error);
  }
};

// Fonction pour récupérer les catégories depuis l'API
const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const categories = await response.json();
    displayBtnsFilters(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fonction pour récupérer les catégories depuis l'API
const displayWorks = (idCategory) => {
  console.log('display works', idCategory);
  gallery.innerHTML = '';
  works.forEach((work) => {
    if (idCategory === 0 || work.categoryId === idCategory) {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;
      const figcaption = document.createElement('figcaption');
      figcaption.innerText = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  });
};

// Fonction pour afficher les boutons de filtrage
const displayBtnsFilters = (categories) => {
  filterButtons.innerHTML = '';
  // Création du bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.innerText = 'Tous';
  allBtn.dataset.id = 0;
  allBtn.classList.add('filter-btn');
  filterButtons.appendChild(allBtn);

  categories.forEach((category) => {
    const btn = document.createElement('button');
    btn.innerText = category.name;
    btn.dataset.id = category.id;
    btn.classList.add('filter-btn');
    filterButtons.appendChild(btn);
  });

  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const categoryId = parseInt(button.dataset.id);
        // Retirer la classe active de tous les boutons
        buttons.forEach((btn) => btn.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        button.classList.add('active');
        // Afficher les works filtrés
      displayWorks(categoryId);
    });
  });
};

const token = sessionStorage.getItem('token');

if (token) {
  // Remplace login par logout si connecté
  loginLink.textContent = 'logout';
  loginLink.href = '#';

  // Déconnexion au clic
  loginLink.addEventListener('click', () => {
    sessionStorage.removeItem('token'); // supprime le token
    window.location.reload(); // recharge la page
  });

  // Masque les filtres quand connecté
  const filtersSection = document.querySelector('.filters');
  if (filtersSection) {
    filtersSection.style.visibility = 'hidden';
  }

  // Création bouton modifier
  const portfolioHeader = document.querySelector('.portfolio-header');
  const editBtn = document.createElement('span');
  editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
  editBtn.classList.add('edit-button');
  editBtn.id = 'open-modal';
  portfolioHeader.appendChild(editBtn);
}

// Gestion ouverture de la modale
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.querySelector('.close-modal');

if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    displayModalGallery(works); // Affiche la galerie dans la modale
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

fetchWorks();
fetchCategories();