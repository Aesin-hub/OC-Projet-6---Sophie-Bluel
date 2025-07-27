// 🔹 TABLE DES MATIÈRES
// 1. Déclarations des variables globales
// 2. Fonctions de récupération des données via l'API
//    - fetchWorks()
//    - fetchCategories()
// 3. Fonctions d'affichage
//    - displayWorks()
//    - displayBtnsFilters()
// 4. Gestion du login / logout
// 5. Affichage conditionnel (bouton modifier, filtres, modale)
// 6. Initialisation au chargement

// ==========================
// 1. VARIABLES GLOBALES
// ==========================

let works = []; // Stocke tous les travaux récupérés via l’API

const gallery = document.querySelector('.gallery');
const filterButtons = document.querySelector('.filters');
const loginLink = document.getElementById('login-link');

// ==========================
// 2. RÉCUPÉRATION DES DONNÉES API
// ==========================

// Fonction pour récupérer les works depuis l'API

// Récupère tous les projets depuis l'API
const fetchWorks = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    works = await response.json();
    window.works = works; // rendre les works accessibles globalement ( pour modal.js par exemple)

    displayWorks(0);  // affiche tous les travaux dans la galerie principale
  } catch (error) {
    console.error('Error fetching works:', error);
  }
};

// Récupère toutes les catégories depuis l'API
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

// ==========================
// 3. AFFICHAGE DES TRAVAUX ET FILTRES
// ==========================

// Affiche tous les travaux ( ou filtrés par catégorie)
const displayWorks = (idCategory) => {
  console.log('display works', idCategory);
  gallery.innerHTML = ''; // vide la galerie avant d'afficher les travaux

  works.forEach((work) => {
    // Affiche tout si idCategory est 0, ou si le work correspond à la catégorie sélectionnée
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

// Créer et affichier les boutons filtres
const displayBtnsFilters = (categories) => {
  filterButtons.innerHTML = '';

  // Bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.innerText = 'Tous';
  allBtn.dataset.id = 0;
  allBtn.classList.add('filter-btn', 'active'); // active par défaut
  filterButtons.appendChild(allBtn);

  allBtn.addEventListener('click', () => {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));    // Ajouter la classe active au bouton "Tous"
    allBtn.classList.add('active');
    // Afficher tous les works
    displayWorks(0);
  });

  // Boutons pour chaque catégorie
  categories.forEach((category) => {
    const btn = document.createElement('button');
    btn.innerText = category.name;   
    btn.classList.add('filter-btn');
    filterButtons.appendChild(btn);

    btn.addEventListener('click', () => {   
      // Retirer la classe active de tous les boutons
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));      
      // Ajouter la classe active au bouton cliqué
      btn.classList.add('active');      
      // Afficher les works filtrés
      displayWorks(category.id);
    });


  });
};

// ==========================
// 4. GESTION DU LOGIN / LOGOUT
// ==========================

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
  // ==========================
  // 5. AFFICHAGE DU MODE ÉDITION
  // ==========================

  // Création bouton modifier
  const portfolioHeader = document.querySelector('.portfolio-header');
  const editBtn = document.createElement('span');
  editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
  editBtn.classList.add('edit-button');
  editBtn.id = 'open-modal';
  portfolioHeader.appendChild(editBtn);

  // Ouvre la modale au clic
  editBtn.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    const modalGallery = document.getElementById('modal-gallery');
    const modalAddPhoto = document.getElementById('modal-add-photo');

    // 1. Forcer la vue galerie par défaut
    modalGallery.classList.remove('hidden'); // Affiche la galerie
    modalAddPhoto.classList.add('hidden'); // Cache la vue ajout photo

    // 2. Réinitialise les champs et la preview
    if (typeof resetAddPhotoForm === 'function') {
      resetAddPhotoForm();
    }

    // 3. Affiche la modale et recharge la galerie
    modal.classList.remove('hidden');
    displayModalGallery(window.works);
  });
}

// ==========================
// 6. INITIALISATION AU CHARGEMENT
// ==========================

window.displayWorks = displayWorks; // Rend accessible dans d'autres fichiers JS
fetchWorks(); // Récupère les travaux
fetchCategories(); // Récupère les catégories

