const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

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

apiRouter.get('/garden/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  res.send(user.garden);
})

// Posts the user's garden to storage.
apiRouter.put('/gardens', async (req, res) => {
  console.log('made it to gardens api');
  const state = await DB.updateGarden(req.body.username, req.body.plantname);
  res.send(200); //is this right?
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


let plants = [
  {url: './plants/rose.png', name: 'rose'},
  {url: './plants/tulip.png', name: 'tulip'},
  {url: './plants/sunflower.png', name: 'sunflower'}
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
