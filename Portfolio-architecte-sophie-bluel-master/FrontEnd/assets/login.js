// 🔹 TABLE DES MATIÈRES
// 1. Sélection du formulaire
// 2. Écoute de l'événement "submit"
// 3. Validation des champs
// 4. Envoi de la requête à l'API
// 5. Traitement de la réponse

// ============================
// 1. SÉLECTION DU FORMULAIRE
// ============================

const form = document.getElementById('login-form'); // Récupère le formulaire HTML

// ============================
// 2. ÉVÉNEMENT AU "SUBMIT"
// ============================

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empeche le rechargement de la page au submit du formulaire

    // ============================
    // 3. VALIDATION DES CHAMPS
    // ============================   
    
    const email = document.getElementById('email').value; // Récupère l'email entré
    const password = document.getElementById('password').value; // Récupère le mot de passe entré

    // Vérifie si l'email contient un @
    if (!email.includes('@')) {
        alert('Veuillez entrer une adresse e-mail valide.');
        return; // Arrete l'execution si l'email est invalide
    }
    
    try {

        // ============================
        // 4. REQUÊTE DE CONNEXION
        // ============================
        
        const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' // indique qu'on envoie du JSON
        },
        body: JSON.stringify({ email, password }) // données envoyées sous forme JSON
        });

        const data = await response.json(); // Récupère la réponse du serveur
    
        // ============================
        // 5. TRAITEMENT DES RÉPONSES
        // ============================

        if (response.ok) {
            // Connexion réussie : on stocke le token et on redirige
            sessionStorage.setItem('token', data.token); // stockage du token dans le sessionStorage
            window.location.href = 'index.html'; // Redirection vers la page d'accueil
        } else if (response.status === 401){
            alert('Erreur 401 : Email ou mot de passe incorrect.');
        } else if (response.status === 404) {
            alert('Erreur 404 : utilisateur introuvable.');
        } else {
            alert('Une erreur est survenue. Code : ' + response.status);
        }
           
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert("Une erreur s'est produite lors de la connexion.");
    }
});