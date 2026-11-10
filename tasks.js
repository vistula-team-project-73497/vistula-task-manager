const storageKey = "module3-tasks";
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#title");
const dueDateInput = document.querySelector("#due-date");
const priorityInput = document.querySelector("#priority");
const categoryInput = document.querySelector("#category");
const error = document.querySelector("#error");
const list = document.querySelector("#task-list");

let tasks = [];

function renderTasks() {
  list.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.textContent =
      `${task.title} | Due ${task.dueDate} | ${task.priority} | ${task.category}`;
    list.append(item);
  }
}

function todayAsDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showError(message, field) {
  error.textContent = message;
  field.focus();
}

try {
  tasks = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
  if (!Array.isArray(tasks)) {
    tasks = [];
    error.textContent = "Saved tasks could not be loaded.";
  }
} catch {
  error.textContent = "Saved tasks could not be loaded.";
}

renderTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";

  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!title) {
    showError("Please enter a task title.", titleInput);
    return;
  }

  if (title.length > 60) {
    showError("The title must be 60 characters or fewer.", titleInput);
    return;
  }

  if (!dueDate) {
    showError("Please choose a due date.", dueDateInput);
    return;
  }

  if (dueDate < todayAsDateString()) {
    showError("The due date cannot be in the past.", dueDateInput);
    return;
  }

  const task = {
    title,
    dueDate,
    priority: priorityInput.value,
    category: categoryInput.value
  };
  const updatedTasks = [...tasks, task];

  try {
    localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
  } catch {
    error.textContent = "The task could not be saved in this browser.";
    return;
  }

  tasks = updatedTasks;
  renderTasks();
  form.reset();
});
