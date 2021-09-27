require('dotenv').config();
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const db = require('./db/db.json');
const { insert } = require('./db/handler');
const middlewares = jsonServer.defaults();
const checkJwt = require('./middlewares/auth');
const handlerError = require('./middlewares/error');

const createJwtToken = (data) => {
  const secret = process.env.JWT_SECRET;
  console.log(secret);
  const token = jwt.sign({ data }, secret, null);
  return token;
}

server.use(middlewares);
server.use(handlerError);
server.use(checkJwt);
server.use(router);
server.post('/login', (req, res) => {
  const email = req.body['email'];
  const password = req.body['password'];
  const user = db.users.find(
    user => user.email === email
  );
  console.log('user: ', user);
  if (!user) {
    res.status(404).json({
      message: 'Invalid credentials',
      errorCode: 'LOGIN_ERROR_INVALID_CREDENTIALS',
    });
    return;
  }
  if (password !== user.password) {
    res.status(404).json({
      message: 'Invalid credentials',
      errorCode: 'LOGIN_ERROR_INVALID_CREDENTIALS',
    });
    return;
  }
  const token = createJwtToken(user);
  res.status(200).json({
    token
  });
  return;
});

server.get('/users/:id/favorites', (req, res) => {
  const userId = req.params['id'];
  const favorites = db.favorites.find((favorite) => favorite.userId === userId);
  res.status(200).json({
    favorites,
  });
  return;
});
server.post('/users/:id/favorites', (req, res) => {
  const userId = req.params['id'];
  const { name } = req.body;
  if (!name) {
    res.status(422).json({ errorCode: 'INVALID_BODY', message: 'Name is required'});
  }
  const favorites = db.favorites.find((favorite) => favorite.userId === userId);
  insert({
    userId,
    name
  });
  res.status(200).json({
    favorites,
  });
  return;
});
server.post(jsonServer.rewriter({'users': 'register'}));
server.listen(3000, () => {
  console.log('JSON Server is running');
});