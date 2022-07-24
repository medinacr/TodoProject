import { generateId } from "./helpers.js"

let folders = []

// DOM elements 
const $folderInput = document.querySelector('#folder-form');
const $createFolderButton = document.querySelector('#create-form');
const $folderList = document.querySelector('#folder-list')
const $taskInput = document.querySelector('#task-input');
const $createTaskButton = document.querySelector('#task-button')
const $taskList = document.querySelector('#task')
//const $taskText = document.getElementById('task-text')

let folderSelected = false;
let selectedFolderId;

//Create Task 
$createTaskButton.addEventListener('click', (e) => {
    if(folderSelected){
        if($taskInput.value === ""){
            return
        }else{
            createTask(selectedFolderId, $taskInput.value);
            displayTasks();
        }
        $taskInput.value = ""
    }
});

// Create and delete folders 
$createFolderButton.addEventListener('click', () => {
    if($folderInput.value === ''){
        return
    }else{
        const $folder = document.createElement("div");
        let folderId = createFolder($folderInput.value);
        $folder.innerHTML=
            `<div id=${folderId} class="folder not-active flex justify-between mx-10 px-10 py-4 rounded-xl border-2 hover:border-indigo-500 cursor-pointer focus:bg-indigo-600 mt-6">
                <p>${$folderInput.value}</p>
                <img id="delete-button" class="ml-2" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
            </div>`
        $folderList.appendChild($folder);
        setActiveFolder(folderId);

        //Delete Folders
        $folder.addEventListener('click', (e) => {
            let img = e.target.closest('img')
            if(!img) return;
            if(!$folder.contains(img)) return;
            const divID = e.path[1].id 
            deleteFolder(divID)
            $folder.remove(img)
            displayTasks()
        })

        //Active folder
        $folder.addEventListener('click', (e) => {
            selectedFolderId = e.path[0].id;
            setActiveFolder(selectedFolderId)
            // displayTasks()
            //$folder.classList.remove('not-active')
            //$folder.classList.add('active')

        })
        $folderInput.value = ""
    }
})

const createFolder = (folderName) => {
    const folder = {
        folderName,
        active: false,
        id: generateId(),
        tasks: []
    }
    folders.push(folder)
    console.log('Creating Folder:' + folder.folderName)
    printFolders()
    return folder.id
}

const deleteFolder = (folderId) => {
    folders = folders.filter(folder => {
        return folder.id !== folderId
    })

    console.log(`Deleting Folder: ${folderId}`)
    printFolders()
}

const setActiveFolder = (folderId) => {
   
    const $folder = document.getElementById(folderId)
    folderSelected = true;
    folders.forEach(folder => {
        if(folderId === folder.id){
            selectedFolderId = folder.id;
            console.log(folder.id)
            folder.active = true
            console.log(`Setting Active Folder: ${folder.folderName}`)
            $folder.classList.remove('not-active')
            $folder.classList.add('active')

        }else{
            folder.active = false
            $folder.classList.remove('active')
            $folder.classList.add('not-active')
        }
    })
    displayTasks()
    printFolders()
}

const displayTasks = () => {
    folders.forEach(folder => {
        if(folder.active){

            //Clear task list currently being displayed
            $taskList.innerHTML = '';

            //Display task list from selected folder
            folder.tasks.forEach(task => {
                const $task = document.createElement('div')

                if(task.completed){
                    $task.innerHTML =
                    `<li><div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                    <div class=" flex-1 flex items-center">
                    <input id="${task.id}" class="completed-task ${task.id}" type="checkbox" checked>
                    <p id="task-text" class="ml-3 task-text line-through">${task.task}</p>
                    </div>
                    <div class="flex-1 flex item-center justify-end">
                        <img id= ${task.id} class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                        <img id= ${task.id} class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                    </div>
                    </div></li>`
                }
                else{
                    $task.innerHTML =
                    `<li><div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                    <div class=" flex-1 flex items-center">
                    <input id="${task.id}" class="completed-task ${task.id}" type="checkbox">
                    <p id="task-text" class="ml-3 task-text">${task.task}</p>
                    </div>
                    <div class="flex-1 flex item-center justify-end">
                        <img id= ${task.id} class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                        <img id= ${task.id} class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                    </div>
                    </div></li>`
                }

                    // delete task button listener 
                    $task.addEventListener('click', (e) => {
                        let deleteButton = e.target.className
                        if(deleteButton.includes('delete-button')){
                           let taskId = e.path[0].id
                           if(!taskId) return;
                        
                           console.log('delete button');
                           deleteTask(taskId);
                           displayTasks()
                        };
                    });

                    //edit task button listener
                    $task.addEventListener('click', (e) => {
                        let editButton = e.target.className
                        if(editButton.includes('edit-button')){
                           let taskId= e.path[0].id
                           if(!taskId) return;
                           let newTask = prompt('Enter new task');
                           editTask(taskId, newTask)
                           displayTasks()
                        }
                    })

                    //completed task button listener 
                    $task.addEventListener('click', (e) => {
                        const $taskText = document.getElementById('task-text')
                        //find correct button 
                        let completedTask = e.target.className

                        if(completedTask.includes('completed-task')){
                            let taskId = e.path[0].id
                            console.log(taskId)
                            if(!taskId) return;
                            toggleTask(taskId) 
                            // $taskText.classList.add('line-through')
                            displayTasks()
                        }
                    })

                    $taskList.appendChild($task)
            });
        }
    });
}

const createTask = (folderId, task) => {
    const id = generateId()
    folders.forEach(folder => {
        if(folderId === folder.id){
            task = {
                id,
                task,
                completed: false
            }
            folder.tasks.push(task)
        }
    })
    printFolders()
    return id
}

const deleteTask = (taskId) => {

    folders.forEach(folder => {
        folder.tasks.forEach(task => {
            if(taskId === task.id){
               folder.tasks = folder.tasks.filter(task => {
                return taskId !== task.id
               }) 
            }
        })
    })
    console.log(`Deleting task: ${taskId}`)
    printFolders()
}

const editTask = (taskId,newTask) => {
    folders.forEach(folder => {
            folder.tasks.forEach(task => {
                if(task.id === taskId){
                    task.task = newTask
                }
            })
    })
    console.log(`Editing task ${taskId}`)
    printFolders()
}

const toggleTask = (taskId) => {
    const $taskText = document.getElementById('task-text')

    folders.forEach(folder => {
            folder.tasks.forEach(task => {
                if(task.id === taskId){
                    task.completed = !task.completed
                    console.log(task.completed)
                    if(task.completed === true){
                       $taskText.classList.add('line-through')
                    }else{
                       $taskText.classList.remove('line-through')
                    }
                }
            })
        
    })
    console.log(`Toggling Task: ${taskId}`)
    printFolders()
}

const printFolders = () => {
    //console.log(folders)
}

const printTasks = (folderId) => {
    folders.forEach(folder => {
        if(folderId === folder.id){
            console.log(folder.tasks)
        }
    })
}

const PUBLIC_API = {
    createFolder,
    deleteFolder,
    setActiveFolder,
    createTask,
    deleteTask,
    editTask,
    toggleTask,
    printFolders,
    printTasks
}

export default PUBLIC_API;