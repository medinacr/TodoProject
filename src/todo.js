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
            const divId = e.path[0].id
            //$taskList.innerHTML = ""
            
            setActiveFolder(divId)
            
            folders.forEach(folder => {
                if(folder.active === true){
                   console.log(`Active Folder: ${folder.folderName}`)
                   //Create Task 
                   $createTaskButton.addEventListener('click', (e) => {
                
                        if($taskInput.value === ""){
                            return
                        }else{
                            console.log($taskInput.value)
                            const taskInputValue = $taskInput.value
                            const $task = document.createElement('div')
                            $task.innerHTML = 
                                `<div class="bg-indigo-50 rounded-xl p-3 mt-6 mx-8 flex">
                                <div class=" flex-1 flex items-center">
                                <input type="checkbox">
                                <p class="ml-3">${taskInputValue}</p>
                                </div>
                                <div class="flex-1 flex item-center justify-end">
                                    <img class="edit-button" src="https://ginnerzapata.github.io/todolist/img/edit.svg" alt="">
                                    <img class="ml-2 delete-button" src="https://ginnerzapata.github.io/todolist/img/delete.svg" alt="">
                                </div>
                                </div>`
                            $taskList.appendChild($task)
                            createTask(divId,$taskInput.value) 
                        }
                        $taskInput.value = ""
                   })
                   folders.forEach(folder => {
                    console.log(folder.tasks)
                   })
                }
            })
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

const deleteTask = (folderId, taskId) => {
    folders.forEach(folder => {
        if(folderId === folder.id){
           folder.tasks = folder.tasks.filter(task => {
                return taskId !== task.id
            })
        }
    })
    console.log(`Deleting task: ${taskId}`)

    printFolders()
}

const editTask = (folderId,taskId,newTask) => {
    folders.forEach(folder => {
        if(folderId === folder.id){
            folder.tasks.forEach(task => {
                if(task.id === taskId){
                    task.task = newTask
                }
            })
        }
    })
    console.log(`Editing task ${taskId}`)
    printFolders()
}

const toggleTask = (folderId,taskId) => {
    folders.forEach(folder => {
        if(folderId === folder.id){
            folder.tasks.forEach(task => {
                if(task.id === taskId){
                    task.completed = !task.completed 
                }
            })
        }
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