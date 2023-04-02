//let myGarden = [];

const PlantEvent = 'Planted';

function getPlayerName(){
    return localStorage.getItem('username');
}

async function fetchGarden() {
    const res = await fetch(`/api/garden/${getPlayerName()}`)
    .then( (httpres) => httpres.json() )
    .then( (res) => { 
        console.log(res);
        return res;
    }) 
    return res;
} 
    // const plants = [];
    // for (let i = 0; i < localStorage.length; i++) {
    //   const key = localStorage.key(i);
    //   if (key.startsWith("plant_")) {
    //     const data = JSON.parse(localStorage.getItem(key));
    //     plants.push(data);
    //   }
    // }
    // return plants.length > 0 ? plants : null;


const plantGrid = document.querySelector('.plants');

function clearGrid(){
    while(plantGrid.childElementCount > 0){
        plantGrid.removeChild(plantGrid.firstChild);
    }
}

function addPlants(){
    window.location.href = "build.html";
}

async function compostPlants(name, id){
    const username = await getPlayerName();
    const response = await fetch('/api/gardens', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            plantname: name,
            username: username,
            del: true,
            id: id
            })
        });
    localStorage.removeItem('plant_' + name);
    loadGrid();
}

function getElNameId(e){
    const elementName = e.target.name;
    const elementId = e.target.id;
    compostPlants(elementName, elementId);
}

function implementDelete(){
    const garbageButtons = document.querySelectorAll('.remove');
    let buttons = Array.from(garbageButtons);
    for(const el of buttons){
        el.addEventListener('click', getElNameId);
    }
}

function implementAdd(){
    const addPlantButton = document.querySelector('.addplant');
    addPlantButton.addEventListener('click', addPlants);
}

async function loadGrid(){
    clearGrid();
    myGarden = await fetchGarden();
    const res = await fetch('/api/plants');
    const plants = await res.json();
    console.log(plants);
    if(myGarden.length <= 0){
        gridData = null;
    } else {
        gridData = myGarden;
    }
    if(gridData === null){
    const addPlant = document.createElement('img');
    addPlant.classList.add('addplant');
    addPlant.setAttribute('src', 'addplant.png');
    plantGrid.appendChild(addPlant);
    }
    else{
        //turns gridData into a plant object array instead of a plant name array; Hate the waste though.
    for(let i = 0; i < plants.length; i++){
        for(let j = 0; j < gridData.length; j++){
            if(gridData[j] === plants[i].name){
                gridData[j] = plants[i];
            }
        }
    }
    for(let i = 0; i < gridData.length; i++){
        const gridPair = document.createElement('div');
        const plant = document.createElement('img');
        plant.classList.add('plant');
        plant.setAttribute('src', gridData[i].url);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('remove');
        deleteBtn.setAttribute('name', gridData[i].name);
        deleteBtn.setAttribute('id', i);
        deleteBtn.textContent = 'Delete Plant';

        gridPair.appendChild(plant);
        gridPair.appendChild(deleteBtn);
        plantGrid.appendChild(gridPair);
    }
    const addPlant = document.createElement('img');
    addPlant.classList.add('addplant');
    addPlant.setAttribute('src', 'addplant.png');
    plantGrid.appendChild(addPlant);
    }
    implementDelete();
    implementAdd();
}

function displayMsg(cls, from, msg) { //do I need to pass socket here?
    const chatText = document.querySelector('#player-messages');
    chatText.innerHTML =
      `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
}

function configureWebSocket(){
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === PlantEvent) {
        displayMsg('Gardener', msg.from, `planted a ${msg.plant}`);
      };
    }
}

configureWebSocket();
loadGrid();