// GALLERY
const gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json())
    .then(data => {
        allWorks = data;
        data.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    })

    .catch(error => {
        console.error("Erreur lors du chargement des projets :", error);
    });

// FILTERS
let allWorks = [];
const filtersContainer = document.querySelector(".filters");

fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json())
    .then(categories => {
        const allBtn = document.createElement("button");
        allBtn.innerText = "Tous";
        allBtn.dataset.id = 0
        allBtn.classList.add("filter-btn");
        filtersContainer.appendChild(allBtn);

        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.innerText = category.name;
            btn.dataset.id = category.id;
            btn.classList.add("filter-btn");
            filtersContainer.appendChild(btn);
        });

        const buttons = document.querySelectorAll(".filters button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const categoryId = parseInt(button.dataset.id);

                gallery.innerHTML = "";

                const filteredWorks = categoryId === 0
                ? allWorks
                : allWorks.filter(work => work.categoryId === categoryId);

                filteredWorks.forEach(work => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    img.src = work.imageUrl;
                    img.alt = work.title;

                    const figcaption = document.createElement("figcaption");
                    figcaption.innerText = work.title;

                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                });
            });
        });
    });