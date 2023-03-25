const {MongoClient} = require('mongodb');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);  //what does this do?
const UserCollection = client.db('plantarium').collection('user');

function updateGarden(username, plantname) {
  const user = getUser(username);
  user.garden.push(plantname)
  const query = {user: username}
  UserCollection.updateOne(query, {$set: {"garden": user.garden}});
}

function getUser(username) {
  const query = {user: username};
  const user = UserCollection.findOne(query);
  return user;
}

module.exports = {getUser, updateGarden};
