const express = require('express');
const app = express();
const DB = require('./database.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const authCookieName = 'token';

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

app.use(cookieParser());

// Serve up the application's static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//Create an Auth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if(await DB.getAuth(req.body.email)){
    res.status(409).send({msg: 'Hey now, that username is taken...'});
  } else {
    const auth = DB.createAuth(req.body.email, req.body.password);

    setAuthCookie(res, auth.token);

    res.send({
      id: auth._id
    });
  };
});

//Get Auth token for login credentials
apiRouter.post('/auth/login', async (req, res) => {
  const auth = await DB.getAuth(req.body.email);
  if(auth) {
    if(await bcrypt.compare(req.body.password, auth.password)){
      setAuthCookie(res, auth.token);
      res.send({id: auth._id});
      return;
    }
  }
  res.status(401).send({msg: 'Girl you are not allowed in. See yourself out before I do'});
})

//Delete auth token on logout
apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
})

//return useless info about an 'auth'
apiRouter.get('/user/:email', async (req,res) => {
  const auth = await DB.getAuth(req.params.email);
  if (auth){
    const token = req?.cookies.token;
    res.send({email: auth.email, authenticated: token === auth.token});
    return;
  }
  res.status(404).send({msg: 'It seems your requested info does not exist'})
})

// GetPlants
apiRouter.get('/plants', (_req, res) => {
  res.send(plants);
});

//Secure router that verifies your credentials
var secureApiRouter = express.Router(); //why var here?
apiRouter.use(secureApiRouter); //any request that goes through api will first go through secure

//use means that every request will go here regardless of what it is
secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const auth = await DB.getAuthByToken(authToken);
  if(auth){
    next();
  } else {
    res.status(401).send({msg: 'You are not welcome'});
  }
})

//IDK WHICH FUNCTIONS I NEED TO CONVERT INTO SECURE

//Get the user's garden from storage
secureApiRouter.get('/garden/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  res.send(user.garden);
})

// Posts the user's garden to storage.
secureApiRouter.put('/gardens', async (req, res) => {
  console.log('made it to gardens api');
  const state = await DB.updateGarden(req.body.username, req.body.plantname, req.body.del, req.body.id);
  res.send(200); //is this right?
});

//Error handler (errors will be passed down until they reach this middleware)
app.use(function (err, req, res, next) {
  res.status(500).send({type: err.name, message: err.message});
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  })
}

let plants = [
  {url: './plants/rose.png', name: 'rose'},
  {url: './plants/tulip.png', name: 'tulip'},
  {url: './plants/sunflower.png', name: 'sunflower'}
];