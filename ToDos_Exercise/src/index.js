const fieldElement = document.getElementById("field");
const listElement = document.querySelector("#task-list");
const counterElement = document.getElementsByClassName("counter")[0];
const filterAllElement = document.getElementById("filter-all-btn");
const filterActiveElement = document.getElementById("filter-active-btn");
const filterCompletedElement = document.getElementById("filter-completed-btn");
const storage = window.localStorage;

const updateCounter = () => {
  counterElement.innerText = `${listElement.querySelectorAll("li:not(.done)").length} left`;
};

const createElement = (task, isTaskCompleted) => {
  const taskElement = document.createElement("li"); // <li></li>

  taskElement.classList.toggle("done", isTaskCompleted);

  taskElement.innerHTML = `
      <input type="checkbox" ${isTaskCompleted ? "checked" : ""} />
      <span class="${isTaskCompleted ? "line-through" : ""}">${task}</span>
      <button class="delete-btn">X</button>
    `;

  return taskElement;
}

const updateTasksFromLocalStorage = (readTasksFromFileCount) => {
  const tasks = Object.keys(storage);

  tasks.forEach((task, index) => {
    if (index < readTasksFromFileCount) {
      return;
    }

    const taskElement = createElement(task, storage.getItem(task) === "true");

    listElement.appendChild(taskElement);
  });
};

const updateTasksFromFile = async () => {
  const response = await fetch("./src/initialTasks.json");
  const json = await response.json();
  const tasks = Object.keys(json);

  tasks.forEach((task) => {
    const taskElement = createElement(task, json[task] === "true");

    if (!storage.getItem(task)) {
      storage.setItem(task, json[task]);
    }

    listElement.appendChild(taskElement);
  });

  return tasks.length;
};

const updateInitialTasks = async () => {
  const readTaskCount = await updateTasksFromFile(); // return promise
  updateTasksFromLocalStorage(readTaskCount);
  updateCounter();
};

updateInitialTasks();

// adding tasks
fieldElement.addEventListener("change", (event) => {
  const task = document.createElement("li"); // <li></li>
  const taskName = event.target.value.trim();

  task.innerHTML = `
    <input type="checkbox" />
    <span>${taskName}</span>
    <button class="delete-btn">X</button>
  `;

  const spanElement = task.querySelector("span");
  const checkboxElement = task.querySelector("input");

  spanElement.classList.toggle("line-through", checkboxElement.checked);
  spanElement.parentElement.classList.toggle("done", checkboxElement.checked);

  event.target.value = "";

  listElement.appendChild(task);

  storage.setItem(taskName, false);

  updateCounter();
});

listElement.addEventListener("input", (event) => {
  const checkboxElement = event.target;
  const spanElement = checkboxElement.parentElement.querySelector("span");
  const taskName = spanElement.textContent.trim();

  spanElement.classList.toggle("line-through", checkboxElement.checked);
  spanElement.parentElement.classList.toggle("done", checkboxElement.checked);

  storage.setItem(taskName, checkboxElement.checked);

  updateCounter();
});

listElement.addEventListener("click", (event) => {
  const element = event.target;

  if (element.classList.contains("delete-btn")) {
    const listItemElement = element.parentElement; // li
    const list = listItemElement.parentElement; // ul
    const taskName = listItemElement.querySelector("span").textContent.trim();

    list.removeChild(listItemElement);

    storage.removeItem(taskName);
    updateCounter();
  }
});

filterAllElement.addEventListener("click", (event) => {
  const listItems = listElement.querySelectorAll("li");

  listItems.forEach((element) => element.removeAttribute("hidden"));
});

filterActiveElement.addEventListener("click", (event) => {
  const listItems = listElement.querySelectorAll("li");

  listItems.forEach((element) =>
    element.toggleAttribute("hidden", element.classList.contains("done"))
  );
});

filterCompletedElement.addEventListener("click", (event) => {
  const listItems = listElement.querySelectorAll("li");

  listItems.forEach((element) =>
    element.toggleAttribute("hidden", !element.classList.contains("done"))
  );
});
