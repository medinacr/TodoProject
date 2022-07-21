import { generateId } from "./helpers.js"

let folders = []

// DOM elements 
const $folderInput = document.querySelector('#folder-form');
const $createFolderButton = document.querySelector('#create-form');
const $folderList = document.querySelector('#folder-list')
const $taskInput = document.querySelector('#task-input');
const $createTaskButton = document.querySelector('#task-button')
const $folderDeleteButton = document.querySelector('#delete-button')
const $taskList = document.querySelector('#task')
//const $folder = document.querySelector('.folder')
let folderSelected = false;
let selectedDivID;

//Create Task 
$createTaskButton.addEventListener('click', (e) => {
    if(folderSelected){
        if($taskInput.value === ""){
            return
        }else{
            const taskInputValue = $taskInput.value
            const $task = document.createElement('div')
            $task.innerHTML =
                `<li><div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                <div class=" flex-1 flex items-center">
                <input type="checkbox">
                <p class="ml-3">${taskInputValue}</p>
                </div>
                <div class="flex-1 flex item-center justify-end">
                    <img class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                    <img class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                </div>
                </div></li>`
            $taskList.appendChild($task)
            createTask(selectedDivID,$taskInput.value) 
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
        $folder.innerHTML=
            `<div id=${createFolder($folderInput.value)} class="not-active flex justify-between mx-10 px-10 py-4 rounded-xl border-2 hover:border-indigo-500 cursor-pointer focus:bg-indigo-600 mt-6">
                <p>${$folderInput.value}</p>
                <img id="delete-button" class="ml-2" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
            </div>`
        $folderList.appendChild($folder);

        
        //Delete Folders
        $folder.addEventListener('click', (e) => {
            let img = e.target.closest('img')
            if(!img) return;
            if(!$folder.contains(img)) return;
            const divID = e.path[1].id 
            deleteFolder(divID)
            $folder.remove(img)
        })

        //Active folder
        $folder.addEventListener('click', (e) => {
            selectedDivID = e.path[0].id;
            setActiveFolder(selectedDivID)
            displayTasks()

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
    console.log('Creating Folder:')
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
    folderSelected = true;
    folders.forEach(folder => {
        if(folderId === folder.id){
            folder.active = true
        }else{
            folder.active = false
        }
    })
    console.log(`Setting Active Folder: ${folderId}`)
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
                $task.innerHTML =
                    `<li><div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                    <div class=" flex-1 flex items-center">
                    <input class="completed-task" type="checkbox">
                    <p class="ml-3">${task.task}</p>
                    </div>
                    <div class="flex-1 flex item-center justify-end">
                        <img id= ${task.id} class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                        <img id= ${task.id} class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                    </div>
                    </div></li>`

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
                        let completedTask = e.target.className
                        if(completedTask.includes(completedTask)){
                            let taskId = e.path[0].id
                            if(!taskId) return;
                            completedTask(taskId)
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
    console.log(`Creating Task: ${task.id}`)
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
    folders.forEach(folder => {
            folder.tasks.forEach(task => {
                if(task.id === taskId){
                    task.completed = !task.completed
                    if(task.completed === true){
                        
                    } 
                }
            })
        
    })
    console.log(`Toggling Task: ${taskId} in Folder: ${folderId}`)
    printFolders()
}

const printFolders = () => {
    console.log(folders)
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

// import { generateId } from "./helpers.js"

// let folders = []

// // DOM elements 
// const $folderInput = document.querySelector('.folder-form');
// const $createFolderButton = document.querySelector('.create-form');
// const $taskInput = document.querySelector('.task-input');
// const $createTaskButton = document.querySelector('.task-button')

// const createFolder = (folderName) => {
//     const folder = {
//         folderName,
//         active: false,
//         id: generateId(),
//         tasks: []
//     }
//     folders.push(folder)
//     console.log('Creating Folder:')
//     printFolders()
//     return folder.id
// }

// const deleteFolder = (folderId) => {
//     folders = folders.filter(folder => {
//         return folder.id !== folderId
//     })

//     console.log(`Deleting Folder: ${folderId}`)
//     printFolders()
// }

// const setActiveFolder = (folderId) => {
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//             folder.active = true
//         }else{
//             folder.active = false
//         }
//     })
//     console.log(`Setting Active Folder: ${folderId}`)
//     printFolders()
// }

// const createTask = (folderId, task) => {
//     const id = generateId()
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//             task = {
//                 id,
//                 task,
//                 completed: false
//             }
//             folder.tasks.push(task)
//         }
//     })
//     printFolders()
//     return id
// }

// const deleteTask = (folderId, taskId) => {
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//            folder.tasks = folder.tasks.filter(task => {
//                 return taskId !== task.id
//             })
//         }
//     })
//     console.log(`Deleting task: ${taskId}`)

//     printFolders()
// }

// const editTask = (folderId,taskId,newTask) => {
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//             folder.tasks.forEach(task => {
//                 if(task.id === taskId){
//                     task.task = newTask
//                 }
//             })
//         }
//     })
//     console.log(`Editing task ${taskId}`)
//     printFolders()
// }

// const toggleTask = (folderId,taskId) => {
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//             folder.tasks.forEach(task => {
//                 if(task.id === taskId){
//                     task.completed = !task.completed 
//                 }
//             })
//         }
//     })
    
//     printFolders()
// }

// const printFolders = () => {
//     console.log(folders)
// }

// const printTasks = (folderId) => {
//     folders.forEach(folder => {
//         if(folderId === folder.id){
//             console.log(folder.tasks)
//         }
//     })
// }

// const PUBLIC_API = {
//     createFolder,
//     deleteFolder,
//     setActiveFolder,
//     createTask,
//     deleteTask,
//     editTask,
//     toggleTask,
//     printFolders,
//     printTasks
// }

// export default PUBLIC_API;