const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Désactive le fonctionnement de submit pour empecher le rechargement de la page
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Vérification des champs
    if (!email.includes('@')) {
        alert('Veuillez entrer une adresse e-mail valide.');
        return;
    }
    
    try {
        // Requête POST pour se connecter
        const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
        }); //

        // Conversion de la réponse en JSON
        const data = await response.json(); 
    
        // Vérification de la réponse
        if (response.ok) {
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
    }
});