const countryBoxTemplate = (country) => {
    let div = document.createElement("div");
    div.classList.add("box");
  
    // let img = document.createElement("img");
    // img.classList.add("box-image");
    // img.alt = `${country.name.common} flag`;
    // img.src = country.flags.svg;
    let img = `<img class="box-image" alt="${country.name.common} flag" src="${country.flags.svg}" />`;
    
    let title = document.createElement("h2");
    title.classList.add("box-title");
    title.innerText = country.name.common;
    
    let btn = document.createElement("button");
    btn.classList.add("box-btn");
    btn.innerText = "See all universities";
    
    div.insertAdjacentHTML("beforeend", img);
    div.appendChild(title);
    div.appendChild(btn);
  
    document.getElementById("wrapper").appendChild(div);
  };
  
  const listItemTemplate = (name) => {
    let li = document.createElement("li");
    li.innerText = name;
  
    document.getElementById("modal-list").appendChild(li);
  };
  
  const toggleModal = (open, country) => {
    let dialogBackground = document.getElementById("dialog-background");
    let dialog = document.getElementById("dialog");
    let title = document.getElementById("modal-title");
  
    document.body.classList.toggle("overflow-hidden", open);
    dialogBackground.toggleAttribute("hidden", !open);
    dialog.toggleAttribute("hidden", !open);
    title.innerText = `Universities in ${country}`;
  };
  
  const loadCountries = async () => {
    const countriesResponse = await fetch("https://restcountries.com/v3.1/region/europe");
    const countries = await countriesResponse.json();
  
    countries.forEach((country) => countryBoxTemplate(country));
  };
  
  const addEventListenersToBtns = () => {
    let buttons = document.querySelectorAll(".box button");
  
    buttons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const parentNode = event.target.parentNode;
        const countryTitle = parentNode.querySelector(".box-title").innerText;
        const universitiesResponse = await fetch(
          `http://universities.hipolabs.com/search?country=${countryTitle}`
        );
        const universities = await universitiesResponse.json();
  
        clearChild();
        universities.forEach((university) => listItemTemplate(university.name));
        toggleModal(true, countryTitle);
      });
    });
  };
  
  const onInitialLoad = async () => {
    await loadCountries();
    addEventListenersToBtns();
  };
  
  onInitialLoad();
  
  const clearChild = () => {
    var modalList = document.querySelector(".modal-list");
  
    var child = modalList.lastElementChild;
    while (child) {
      modalList.removeChild(child);
      child = modalList.lastElementChild;
    }
  };
  
  const closeBtn = document.getElementById("close-list-btn");
  
  closeBtn.addEventListener("click", (event) => {
    toggleModal(false);
  });
  