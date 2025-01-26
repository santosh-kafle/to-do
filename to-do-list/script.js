document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-task');
    const inputField = document.querySelector('input[name="new-task"]');
    const taskList = document.getElementById('task-list');
    const filterSelect = document.getElementById('filter');

    // Load tasks from local storage on page load
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);

    // Add new task
    addButton.addEventListener('click', addTask);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filter tasks
    filterSelect.addEventListener('change', () => {
        renderTasks(tasks);
    });

    function addTask() {
        const taskText = inputField.value.trim();
        if (!taskText) {
            alert('Task cannot be empty!');
            return;
        }
        const newTask = {
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(tasks);
        inputField.value = '';
    }

    function renderTasks(taskArray) {
        taskList.innerHTML = '';
        const filterValue = filterSelect.value;
        taskArray.forEach((task, index) => {
            if (
                filterValue === 'completed' && !task.completed ||
                filterValue === 'active' && task.completed
            ) {
                return;
            }
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            const span = document.createElement('span');
            span.textContent = task.text;

            // Complete/Undo button
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks(tasks);
            });

            // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                enterEditMode(li, span, index);
            });

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(tasks);
            });

            li.appendChild(span);
            li.appendChild(completeButton);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }

    function enterEditMode(li, span, index) {
        li.innerHTML = '';
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = tasks[index].text;
        editInput.classList.add('edit-input');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            tasks[index].text = editInput.value.trim() || tasks[index].text;
            saveTasks();
            renderTasks(tasks);
        });

        li.appendChild(editInput);
        li.appendChild(saveButton);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});