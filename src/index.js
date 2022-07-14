// create/add buttons
// delete button 
// edit button

// create folder 
// delete folder 
// click on folder to open contents 

// create task 
// delete task 
// edit task 
// checkmark tasks

// event listeners for buttons 

// object to store folder 
// object to store task 

let todoList = []

const $createButton = document.querySelector('#create-form');
const $folderInput = document.querySelector('#folder-form');
const $folderList = document.querySelector('#folder-list');
const $taskButton = document.querySelector('#task-button');
const $taskInput = document.querySelector('#task-input');
const $taskList = document.querySelector('#task');


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}



const createFolderElement = (id) => {
    const folder = document.createElement("div");
    folder.innerHTML=`<div id="${id}" class="not-active flex justify-between mx-10 px-10 py-4 rounded-xl border-2 hover:border-indigo-500 cursor-pointer focus:bg-indigo-600 mt-6">
    <p>${$folderInput.value}</p>
    <svg fill="none" viewBox="0 0 24 24" class="w-6">
    <path d="m16.414 12 1.414-1.414a1 1 0 0 0-1.414-1.414L15 10.586l-1.414-1.414a1 1 0 1 0-1.414 1.414L13.586 12l-1.414 1.414a1 1 0 1 0 1.414 1.414L15 13.414l1.414 1.414a1 1 0 1 0 1.414-1.414L16.414 12ZM9.828 5H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9.828a2 2 0 0 1-1.414-.586l-5.707-5.707a1 1 0 0 1 0-1.414l5.707-5.707A2 2 0 0 1 9.828 5Z"/>
    </svg>`

    $folderList.appendChild(folder);
    return folder.firstChild;
}

const generateFolderData = (id)=> {
    const data = {
        id,
        name: $folderInput.value.trim(),
        active: false,
        todos: []
    }

    todoList.push(data);
    $folderInput.value = "";
    return data;
}

function displayTodo(value) {
    const createTask = document.createElement('div');
            createTask.innerHTML = ` <div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
            <div class=" flex-1 flex items-center">
              <input type="checkbox">
              <p class="ml-3">${value}</p>
            </div>
            <div class="flex-1 flex item-center justify-end">
                <img class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                <img class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
            </div>
          </div>`;
          createTask.querySelector('.delete-button').addEventListener('click', () => {
            console.log(todoList)
            todoList.forEach((folder)=>{
                if(folder.active) {
                    console.log($taskInput.value);
                    folder.todos.splice(folder.todos.indexOf($taskInput.value), 1);
                    updateTodoUi();
                }
            });
        })          
        $taskList.appendChild(createTask)
}

function updateTodoUi() {
    $taskList.innerHTML = "";
    activeFolder = todoList.filter((todo)=> {
        return todo.active
    });
    if (activeFolder.length > 0) {
        $taskInput.readOnly = false;
        $taskButton.classList.add('bg-indigo-600')
        $taskButton.classList.remove('bg-gray-300')
        activeFolder[0].todos.forEach((todo) => {
            displayTodo(todo)
        })

    } else {
        // make it gray and read only
        $taskInput.readOnly = true;
        $taskButton.classList.remove('bg-indigo-600')
        $taskButton.classList.add('bg-gray-300')
    }
}

const addEventListenerToFolder = ($folder, data)=> {
    
    $folder.addEventListener('click', (e) => {
        if(e.target.tagName !== 'path' && e.target.tagName !== 'svg') {
            let target;
            if ($folder !== e.target) {
                target = $folder;
            } else {
                target = e.target;
            }
            todoList.forEach(todo => {
                todo.active = false;
                document.getElementById(todo.id).classList.remove('active');
                document.getElementById(todo.id).classList.add('not-active');
            });
    
            data.active = true;
            target.classList.remove('not-active');
            target.classList.add('active');

            updateTodoUi();
        }
    
    }, false);

}

const addRemoveEventListener = ($folder)=>{
    $folder.querySelector('svg').addEventListener('click', (e) => {
        todoList = todoList.filter(folder => {
            return $folder.id !== folder.id;
        });
        $folder.parentNode.remove();
        updateTodoUi();
        console.log(todoList);
    })
}

$createButton.addEventListener('click', () => {
    if($folderInput.value.trim() !== ''){
        const id = uuidv4();
        const $folder = createFolderElement(id);
        const data = generateFolderData(id);
        addEventListenerToFolder($folder, data);
        addRemoveEventListener($folder);
    }
});


$taskButton.addEventListener('click', () => {
    console.log(todoList)
    todoList.forEach(todo => {
        if(todo.active === true){
            todo.todos.push($taskInput.value)
            const $createTask = document.createElement('div');
            $createTask.innerHTML = ` <div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                <div class=" flex-1 flex items-center">
                <input class="checkbox-button" type="checkbox">
                <p class="task-text ml-3">${$taskInput.value}</p>
                </div>
                <div class="flex-1 flex item-center justify-end">
                <img class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                <img class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                </div>
            </div>`
            $taskList.appendChild($createTask)

            $createTask.querySelector('.delete-button').addEventListener('click', () => {
                todoList.forEach((folder)=>{
                    console.log(folder)
                    if(folder.active) {
                        console.log($taskInput.value);
                        // folder.todos.splice(folder.todos.indexOf($taskInput.value), 1);
                        // updateTodoUi();
                    }
                });
            });
            
        }
    })
    $taskInput.value = ""
})




