
let arrayDatas = [];
let taskObject;
let editMode = false; // Track whether we're in edit mode
let taskToEditId = null; // Store the ID of the task being edited
// let filterDate = false;

const addButton = document.getElementById('addButton');
const dataContainer = document.getElementById('main');

addButton.addEventListener('click', () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;


  if (editMode) {
    // Update the existing task if in edit mode
    arrayDatas = arrayDatas.map(task => {
      if (task.id === taskToEditId) {
        taskObject = { ...task, title, description, date };
        updateTask(taskObject); // Update the UI for the edited task
        return taskObject;
      }
      return task;
    });

    editMode = false; // Reset the edit mode
    taskToEditId = null; // Clear the ID of the task being edited
  } else {
    // Create a new task object if not in edit mode
    taskObject = {
      title: title,
      description: description,
      date: date,
      id: Date.now() // Unique ID to identify each task
    };

    arrayDatas.push(taskObject); // Add the new task to the array
    createTask(taskObject); // Create the task in the UI
  }

  // Clear the form fields
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('date').value = '';
});

// Function to create a new task in the UI
function createTask(taskObject) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('task-item');
  newDiv.id = `task-${taskObject.id}`; // Assign a unique ID to the div

  // Populate the new div with task details and buttons
  newDiv.innerHTML = `
    <div class="storage" id="storage-${taskObject.id}">
      <h5>${taskObject.title}</h5>
      <p>${taskObject.description}</p>
      <h6>Date: ${taskObject.date}</h6>
      
    </div>
    <div class="buttons">
      <button class="btn btn-danger btn-sm" onclick="deleteTask(${taskObject.id})">Delete</button>
      <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editTask(${taskObject.id})">Edit</button>
      <button class="btn btn-success btn-sm" id="complete-btn-${taskObject.id}" onclick="markAsCompleted(${taskObject.id})">Mark as Completed</button>
    </div>
  `;

  dataContainer.appendChild(newDiv);
}

// Function to update an existing task in the UI
function updateTask(taskObject) {
  const taskDiv = document.getElementById(`task-${taskObject.id}`);
  if (taskDiv) {
    taskDiv.innerHTML = `
      <div class="storage" id="storage-${taskObject.id}">
        <h5>${taskObject.title}</h5>
        <p>${taskObject.description}</p>
        <h6>Date: ${taskObject.date}</h6>
  document.getElementById('addButton').textContent='Update'

        
            </div>
      <div class="buttons">
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${taskObject.id})">Delete</button>
        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editTask(${taskObject.id})">Edit</button>
        <button class="btn btn-success btn-sm" id="complete-btn-${taskObject.id}" onclick="markAsCompleted(${taskObject.id})">Mark as Completed</button>
      </div>
    `;
  }
}

// Function to delete a task
function deleteTask(id) {
  // Filter out the task from the arrayDatas array
  arrayDatas = arrayDatas.filter(task => task.id !== id);
  console.log(arrayDatas);

  // Remove the task's div from the UI
  const taskDiv = document.getElementById(`task-${id}`);
  if (taskDiv) {
    taskDiv.remove();
  }
}

// Function to mark a task as completed
function markAsCompleted(id) {
  const task = arrayDatas.find(task => task.id === id); // Find the task in the array

  if (task) {
    // Toggle the completed status
    task.completed = !task.completed;

    // Update the task's text style to show it's marked as completed or unread
    const taskStorage = document.getElementById(`storage-${id}`);
    const completeButton = document.getElementById(`complete-btn-${id}`);

    if (task.completed) {
      taskStorage.style.textDecoration = 'line-through';
      taskStorage.style.color = 'grey';
      completeButton.textContent = 'Mark as Unread';
      completeButton.classList.remove('btn-success');
      completeButton.classList.add('btn-secondary');
    } else {
      taskStorage.style.textDecoration = 'none';
      taskStorage.style.color = 'black';
      completeButton.textContent = 'Mark as Completed';
      completeButton.classList.remove('btn-secondary');
      completeButton.classList.add('btn-success');
    }
  }
}

// Function to edit a task
function editTask(id) {
  const taskToEdit = arrayDatas.find(task => task.id === id); // Find the task to edit
  if (taskToEdit) {
    // Pre-fill the form fields with the task details
    document.getElementById('title').value = taskToEdit.title;
    document.getElementById('description').value = taskToEdit.description;
    document.getElementById('date').value = taskToEdit.date;
    editMode = true; // Set the edit mode to true
    taskToEditId = id; // Store the ID of the task being edited
  }
}

// Get the filter date input element
const filterDate = document.getElementById('filter-date');

// Add an event listener to filter tasks when the date changes
filterDate.addEventListener('change', () => {
  const selectedDate = filterDate.value; // Get the selected date
  filterTasksByDate(selectedDate); // Call the filter function
});

// Function to filter tasks by date and update the UI
function filterTasksByDate(date) {
  // Clear all current tasks from the UI
  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach(task => task.remove());

  // Filter the tasks by the selected date and recreate them in the UI
  const filteredTasks = arrayDatas.filter(task => task.date === date);
  filteredTasks.forEach(task => createTask(task));

}

