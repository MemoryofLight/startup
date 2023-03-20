

function getPlantsFromLocalStorage() {
    const plants = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("plant_")) {
        const data = JSON.parse(localStorage.getItem(key));
        plants.push(data);
      }
    }
    return plants.length > 0 ? plants : null;
}

const plantGrid = document.querySelector('.plants');

function clearGrid(){
    while(plantGrid.childElementCount > 0){
        plantGrid.removeChild(plantGrid.firstChild);
    }
}

function addPlants(){
    window.location.href = "build.html";
}

function compostPlants(name){
    localStorage.removeItem('plant_' + name);
    loadGrid();
}

function getElementId(e){
    const elementId = e.target.id;
    compostPlants(elementId);
}

function implementDelete(){
    const garbageButtons = document.querySelectorAll('.remove');
    let buttons = Array.from(garbageButtons);
    for(const el of buttons){
        el.addEventListener('click', getElementId);
    }
}

function implementAdd(){
    const addPlantButton = document.querySelector('.addplant');
    addPlantButton.addEventListener('click', addPlants);
}

function loadGrid(){
    clearGrid();
    const gridData = getPlantsFromLocalStorage();
    if(gridData === null){
    const addPlant = document.createElement('img');
    addPlant.classList.add('addplant');
    addPlant.setAttribute('src', 'addplant.png');
    plantGrid.appendChild(addPlant);
    }
    else{
    gridData.forEach(element => {
        const gridPair = document.createElement('div');
        const plant = document.createElement('img');
        plant.classList.add('plant');
        plant.setAttribute('src', element.url);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('remove');
        deleteBtn.setAttribute('id', element.name);
        deleteBtn.textContent = 'Delete Plant';

        gridPair.appendChild(plant);
        gridPair.appendChild(deleteBtn);
        plantGrid.appendChild(gridPair);
    });
    const addPlant = document.createElement('img');
    addPlant.classList.add('addplant');
    addPlant.setAttribute('src', 'addplant.png');
    plantGrid.appendChild(addPlant);
    }
    implementDelete();
    implementAdd();
}

loadGrid();