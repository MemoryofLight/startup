const plants = [
    {url: './plants/roseflower.png', name: 'rose'},
    {url: './plants/tulipflower.png', name: 'tulip'},
    {url: './plants/sunflowerflower.png', name: 'sunflower'}
];

const plantButton = document.querySelector('#plantbutton');
const leftButton = document.querySelector('#ptleft');
const rightButton = document.querySelector('#ptright');
const currentImgEl = document.querySelector('#currentImg');

let plantIndex = 0;

function fetchPlants(){
    const plants = [
        {url: './plants/roseflower.png', name: 'rose'},
        {url: './plants/tulipflower.png', name: 'tulip'},
        {url: './plants/sunflowerflower.png', name: 'sunflower'}
    ];
    return plants;
    // fetch()
    // .then(response => response.text())
    // .then(data => {
    //     const parser = new DOMParser();
    //     const html = parser.parseFromString(data, 'text/html');
    //     const fileLinks = html.querySelectorAll('a[href$="flower.jpg"]');
    //     fileLinks.forEach(link => {
    //     const url = link.getAttribute(href);
    //     const name = url.split('/').pop().split('.')[0];
    //     plants.push({url: url, name: name});
    //     });
    // });
}

function displayCurrentPlant(){
    currentImgEl.src = fetchPlants()[plantIndex].url;
}

function leftImage(){
    if(plantIndex === 0){
        plantIndex = fetchPlants().length - 1;
    }
    else {
        plantIndex--;
    }
    displayCurrentPlant();
}

function rightImage(){
    if(plantIndex === (fetchPlants().length - 1)){
        plantIndex = 0;
    }
    else{
        plantIndex++;
    }
    displayCurrentPlant();
}

function savePlant(){
    localStorage.setItem('plant_' + fetchPlants()[plantIndex].name, JSON.stringify(plants[plantIndex]));
    window.location.href = "garden.html";
}

displayCurrentPlant();
leftButton.addEventListener('click', leftImage);
rightButton.addEventListener('click', rightImage);
plantButton.addEventListener('click', savePlant);
