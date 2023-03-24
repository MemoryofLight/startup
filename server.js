const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the application's static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetPlants
apiRouter.get('/plants', (_req, res) => {
  res.send(plants);
});

apiRouter.get('/gardendisplay', async (req, res) => {
  const garden = await DB.getGarden();
  res.send(garden);
})

// Posts the user's garden to storage.
apiRouter.put('/gardens', (req, res) => {
  const state = DB.updateGarden(req.body); //I need req body to be the plant object
  if(state === true){ //idk if this is necessary
  res.status(200).send('Plant added to garden.'); // Send a response indicating success
  }
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


let plants = [
  {url: './plants/roseflower.png', name: 'rose'},
  {url: './plants/tulipflower.png', name: 'tulip'},
  {url: './plants/sunflowerflower.png', name: 'sunflower'}
];

const gardens = {};

function updateGarden(userName, plantobj){
    if (gardens.has(userName)) {
      // If the user already has a garden, update the array of plants
      const garden = gardens.get(userName);
      garden.push(plantobj);
      gardens.set(userName, garden);
    } else {
      // If the user does not have a garden, create a new array with the updated plant
      gardens.set(userName, plantobj);
    }
    return true;
  };
