// Define UI Elements
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// Array to store tasks
let tasks = [];

// Add Task
addTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false });
        newTaskInput.value = '';
        renderTasks();
    }
});

// Render Tasks
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });
    
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="edit-task" data-index="${index}">Edit</button>
                <button class="delete-task" data-index="${index}">Delete</button>
                <button class="toggle-completed" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Filter Tasks
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');
        renderTasks(button.id.replace('filter-', ''));
    });
});

// Mark Task as Completed or Undo
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-completed')) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        renderTasks(document.querySelector('.filter-btn.active').id.replace('filter-', ''));
    }
});

// Delete Task
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks(document.querySelector('.filter-btn.active').id.replace('filter-', ''));
    }
});

// Edit Task
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-task')) {
        const index = e.target.dataset.index;
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            renderTasks(document.querySelector('.filter-btn.active').id.replace('filter-', ''));
        }
    }
});
