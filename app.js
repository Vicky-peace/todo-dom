document.addEventListener('DOMContentLoaded', () =>{
    const todoInput = document.getElementById('todo-input');
    const submitBtn = document.getElementById('submit-btn');
    const todoList = document.getElementById('inputs');
    const itemsLeft = document.querySelector('.items-left span');
    const  allBtn = document.querySelector('.all');
    const activeBtn = document.querySelector('.active');
    const completedBtn = document.querySelector('.completed');
    const clearCompletedBtn = document.querySelector('.clear-completed');

    //Load todos from local storage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    //Update the items
    function updateItemsLeft(){
        const activeTodos = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = activeTodos;
    }
    // saving to local storage
    function saveToLocalStorage(){
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    function renderTodos(filter = 'all'){
        todoList.innerHTML ='';
        const filteredTodos = todos.filter(todo =>{
            if(filter === 'all') return true;
            if(filter === 'active') return !todo.completed;
            if(filter === 'completed') return todo.completed;
        });

        filteredTodos.forEach((todo,index) =>{
            const li = document.createElement('li');
            li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
        <span contenteditable="true" class="${todo.completed ? 'completed' : ''}" data-index="${index}">${todo.text}</span>
        <button class="remove-btn" data-index="${index}">x</button>
            `;
            todoList.appendChild(li);
        });
    }

    //function to add todos
    function addTodo(){
        const text = todoInput.value.trim();
        if(text){
            todos.push({text,completed: false});
            todoInput.value ='';
            saveToLocalStorage();
            renderTodos();
            updateItemsLeft();
        }
    }

    function toggleTodo(index){
        todos[index].completed= !todos[index].completed;
        saveToLocalStorage();
        renderTodos();
        updateItemsLeft();
    }

    function editTodo(index,newText){
        todos[index].text = newText;
        saveToLocalStorage();
    }

    function removeTodo(index){
        todos.splice(index, 1);
        saveToLocalStorage();
        renderTodos();
        updateItemsLeft();
    }
    function clearCompletedTodos(){
        todos = todos.filter(todo => !todo.completed);
        saveToLocalStorage();
        renderTodos();
        updateItemsLeft();
    }

    submitBtn.addEventListener('click', addTodo);

    todoList.addEventListener('click', (e) =>{
        const index = e.target.getAttribute('data-index');
        if(e.target.matches('input[type= "checkbox"]')){
            toggleTodo(index);
        }else if(e.target.matches('.remove-btn')){
            removeTodo(index);
        }
    });

    todoList.addEventListener('input', (e) =>{
        const index = e.target.getAttribute('data-index');
        if(e.target.matches('span')){
            editTodo(index, e.target.textContent);
        }
    });
    allBtn.addEventListener('click', () => renderTodos('all'));
    activeBtn.addEventListener('click', () => renderTodos('active'));
    completedBtn.addEventListener('click', () => renderTodos('completed'));
    clearCompletedBtn.addEventListener('click', clearCompletedTodos);

    //Initial render
    renderTodos();
    updateItemsLeft();
})