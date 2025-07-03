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
}

fetchWorks();
fetchCategories();