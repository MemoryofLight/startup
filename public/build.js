
const plantButton = document.querySelector('#plantbutton');
const leftButton = document.querySelector('#ptleft');
const rightButton = document.querySelector('#ptright');
const currentImgEl = document.querySelector('#currentImg');

let socket;

const PlantEvent = 'Planted';

let plantIndex = 0;
let plants;

function fetchPlants(){
    fetch('/api/plants')
    .then( (httpres) => httpres.json() )
    .then( (res) => {
        plants = res;
        displayCurrentPlant();
    })   
}

function displayCurrentPlant(){
    currentImgEl.src = plants[plantIndex].url;
}

async function leftImage(){
    if(plantIndex === 0){
        plantIndex = plants.length - 1;
    }
    else {
        plantIndex--;
    }
    await displayCurrentPlant();
}

async function rightImage(){
    if(plantIndex === (plants.length - 1)){
        plantIndex = 0;
    }
    else{
        plantIndex++;
    }
    await displayCurrentPlant();
}

function getPlayerName(){ //should I update this to get it from the database?
    console.log(localStorage.getItem('username'));
    return localStorage.getItem('username');
}

function savePlantLocal(){
    localStorage.setItem('plant_' + plants[plantIndex].name, JSON.stringify(plants[plantIndex]));
    window.location.href = "garden.html";
}

async function savePlant(){
    const username = getPlayerName();
    try {
        await fetch('/api/gardens', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            plantname: plants[plantIndex].name,
            username: username,
            del: false,
            id: null
            })
        });
        broadcastEvent(socket, getPlayerName(), PlantEvent, plants[plantIndex].name);
        window.location.href = "garden.html";
    } catch {
        savePlantLocal();
    }
}

  // Functionality for peer communication using WebSocket

function configureWebSocket(){
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onopen = (event) => {
      displayMsg('system', 'plants', 'being tended');
    };
    socket.onclose = (event) => {
      displayMsg('system', 'plants', 'absorbing sunshine');
    };
    socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === PlantEvent) {
        displayMsg('Gardener', msg.from, `planted a ${msg.plant}`);
    };
  }
}

function displayMsg(cls, from, msg) { //do I need to pass socket here?
    const chatText = document.querySelector('#player-messages');
    chatText.innerHTML =
      `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
  }

function broadcastEvent(socket, from, type, plant) {
    const event = {
      from: from,
      type: type,
      plant: plant,
    };
    socket.send(JSON.stringify(event));
  }

configureWebSocket();
fetchPlants();
leftButton.addEventListener('click', leftImage);
rightButton.addEventListener('click', rightImage);
plantButton.addEventListener('click', savePlant);
