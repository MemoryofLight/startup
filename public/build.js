
const plantButton = document.querySelector('#plantbutton');
const leftButton = document.querySelector('#ptleft');
const rightButton = document.querySelector('#ptright');
const currentImgEl = document.querySelector('#currentImg');

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

function getPlayerName(){
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
        const response = await fetch('/api/gardens', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            plantname: plants[plantIndex].name,
            username: username
            })
        });
        console.log('I am going to end this man')
        localStorage.setItem('plant_' + plants[plantIndex].name, JSON.stringify(plants[plantIndex]));
        console.log('Please shut up');
        //window.location.href = "garden.html";
    } catch {
        savePlantLocal();
    }
}

fetchPlants();
leftButton.addEventListener('click', leftImage);
rightButton.addEventListener('click', rightImage);
plantButton.addEventListener('click', savePlant);
