const mealsList = document.getElementsByClassName("meals")[0];
const firstPageBtn = document.getElementsByClassName("first-page")[0];
const prevPageBtn = document.getElementsByClassName("prev-page")[0];
const nextPageBtn = document.getElementsByClassName("next-page")[0];
const lastPageBtn = document.getElementsByClassName("last-page")[0];
const pageElementNumbersParag = document.querySelector(".pagination-buttons .page-element-numbers");
const modal = document.getElementsByClassName("modal")[0];
const filterButtons = document.querySelectorAll(".filter-buttons input");

let meals = [];
let filteredMeals = [];
let pageStartElement = 0;
let lastPageStartElement = 0;
let nameFilterValue = "";
let regionFilterValue = "";
let categoryFilterValue = "";

async function getData() {
    const response = await fetch("https://api.npoint.io/51ed846bdd74ff693d7e");
    const data = await response.json();

    return data;
}

//#region filtration
function filterMeals() {
    filteredMeals = meals
            .filter(m => m.name.toLowerCase().includes(nameFilterValue) && 
                         m.category.toLowerCase().startsWith(categoryFilterValue) &&
                         m.region.toLowerCase().startsWith(regionFilterValue));

    pageStartElement = 0;
    lastPageStartElement = filteredMeals.length - (filteredMeals.length % 10);

    loadPageMeals();
}

// add event listener to the filter buttons
(() => {
    filterButtons.forEach(b => b.addEventListener("change", e => {
        const filterValue = e.target.value.toLowerCase();
        switch(e.target.id) {
            case "name-filter":
                nameFilterValue = filterValue;
                break;
            case "region-filter":
                regionFilterValue = filterValue;
                break;
            case "category-filter":
                categoryFilterValue = filterValue;
                break;
        }

        filterMeals();
    }));
})();
//#endregion

//#region pagination buttons events
firstPageBtn.addEventListener("click", e => {
    pageStartElement = 0;

    loadPageMeals();
});

prevPageBtn.addEventListener("click", e => {
    pageStartElement -= 20;

    loadPageMeals();
});

nextPageBtn.addEventListener("click", e => {    
    loadPageMeals();
});

lastPageBtn.addEventListener("click", e => {
    pageStartElement = lastPageStartElement;

    loadPageMeals();
});
//#endregion

function createImageNameSection(meal) {
    const nameMaxLength = 50;

    const imageNameSection = document.createElement("section");
    const img = `<img alt="Meal Image" src="${meal.image}" />`;
    const nameSpan = document.createElement("span");
    nameSpan.textContent = meal.name.length > nameMaxLength ? meal.name.substring(0, nameMaxLength) + "..." : meal.name;
    imageNameSection.insertAdjacentHTML("beforeend", img);
    imageNameSection.appendChild(nameSpan);
    
    return imageNameSection;
}

modal.getElementsByClassName("close-recipe")[0].addEventListener("click", e => {
    modal.style.display = "none";
});

function addEventListenerToRecipeButton(button, meal) {
    button.addEventListener("click", e => {
        modal.style.display = "block";
        modal.getElementsByClassName("title")[0].textContent = meal.name;
        modal.querySelector("main img").src = meal.image;
        modal.querySelector("main .meal-instructions").textContent = meal.instruction;
    });
}

function createCategoryRecipeSection(meal) {
    const categoryRecipeSection = document.createElement("section");

    const categoryRegionSpan = document.createElement("span");
    categoryRecipeSection.textContent = `${meal.category}, ${meal.region}`;
    
    const recipeButton = document.createElement("button");
    recipeButton.classList.add("see-more");
    recipeButton.textContent = "See recipe";

    addEventListenerToRecipeButton(recipeButton, meal);
    
    categoryRecipeSection.appendChild(categoryRegionSpan);
    categoryRecipeSection.appendChild(recipeButton);

    return categoryRecipeSection;
}

function disablePaginationButtons() {
    firstPageBtn.toggleAttribute("disabled", pageStartElement === 0);
    prevPageBtn.toggleAttribute("disabled", pageStartElement === 0);
    nextPageBtn.toggleAttribute("disabled", pageStartElement === lastPageStartElement);
    lastPageBtn.toggleAttribute("disabled", pageStartElement === lastPageStartElement);
}

function loadPageMeals() {
    disablePaginationButtons();
    
    if (pageStartElement < 0) {
        pageStartElement = 0;
    }

    const lastElem = pageStartElement + 10;
    pageElementNumbersParag.textContent = `${pageStartElement + 1}-${lastElem}`;

    const tenMeals = filteredMeals.slice(pageStartElement, lastElem);
    pageStartElement = lastElem;
    mealsList.innerHTML = "";
    
    for (let meal of tenMeals) {
        const li = document.createElement("li");
        const imageNameSection = createImageNameSection(meal);
        const categoryRecipeSection = createCategoryRecipeSection(meal);

        li.appendChild(imageNameSection);
        li.appendChild(categoryRecipeSection);

        mealsList.appendChild(li);
    }
}

getData().then(data => {
    meals = data.meals;
    filteredMeals = meals;
    lastPageStartElement = filteredMeals.length - (filteredMeals.length % 10);

    loadPageMeals();
});