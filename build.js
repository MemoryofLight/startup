const plants = [
    {url: './plants/roseflower.png', name: 'rose'},
    {url: './plants/tulipflower.png', name: 'tulip'},
    {url: './plants/sunflowerflower.png', name: 'sunflower'}
];

function fetchPlants(){
    fetch('./plants/')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const html = parser.parseFromString(data, 'text/html');
        const fileLinks = html.querySelectorAll('a[href$="flower.jpg"]');
        fileLinks.forEach(link => {
        const url = link.getAttribute(href);
        const name = url.split('/').pop().split('.')[0];
        plants.push({url: url, name: name});
        });
    });
}

function displayCurrentPlant(){
    currentImgEl.src = plants[plantIndex];
}

fetchPlants();
displayCurrentPlant();
const plantButton = document.querySelector('#plantbutton');
const leftButton = document.querySelector('#ptleft');
const rightButton = document.querySelector('#ptright');
const currentImgEl = document.querySelector('#currentImg');
let plantIndex = 0;




leftButton.addEventListener('click', )
//plantButton.addEventListener('click', savePlant())