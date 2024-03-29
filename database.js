const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);  //what does this do?
const UserCollection = client.db('plantarium').collection('user');
const AuthCollection = client.db('plantarium').collection('authpeeps');

function getAuth(email){
  return AuthCollection.findOne({email: email});
}

function getAuthByToken(token){
  return AuthCollection.findOne({token: token});
}

async function createAuth(email, password){
  const passwordHash = await bcrypt.hash(password, 10);

  const auth = {
    email: email,
    password: passwordHash,
    token: uuid.v4()
  };
  await AuthCollection.insertOne(auth);

  return auth;
}

async function updateGarden(username, plantname, del, id) { //This could maybe be two different endpoints but oh well
  const user = await getUser(username);
  if (del === false){
    user.garden.push(plantname)
    const query = {user: username}
    UserCollection.updateOne(query, {$set: {"garden": user.garden}});
  }
  else {
    user.garden.splice(id, 1);
    const query = {user: username}
    UserCollection.updateOne(query, {$set: {"garden": user.garden}})
  }
}

async function getUser(username) {
  const query = {user: username};
  const user = await UserCollection.findOne(query);
  if (user === null){
    const newUser = {user: username, garden: []};
    UserCollection.insertOne(newUser);
    return newUser;
  } else{
    return user;
  }
}

module.exports = {
  getUser, 
  updateGarden,
  getAuth,
  getAuthByToken,
  createAuth
};
