require('dotenv').config();
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const db = require('./db/db.json');
const { insert } = require('./db/handler');
const middlewares = jsonServer.defaults();
const checkJwt = require('./middlewares/auth');
const handlerError = require('./middlewares/error');
const delay = require('./middlewares/delay');
const { createJwtToken } = require('./helper/auth');

server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(handlerError);
server.use(delay);
server.use(checkJwt);

server.post('/login', (req, res) => {
  const email = req.body['email'];
  const password = req.body['password'];
  const user = db.users.find((user) => user.email === email);
  if (!user) {
    res.status(401).json({
      message: 'Invalid credentials',
      errorCode: 'LOGIN_ERROR_INVALID_CREDENTIALS',
    });
    return;
  }
  if (password !== user.password) {
    res.status(401).json({
      message: 'Invalid credentials',
      errorCode: 'LOGIN_ERROR_INVALID_CREDENTIALS',
    });
    return;
  }
  delete user.password;
  const token = createJwtToken(user);
  res.status(200).json({
    token,
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
server.post('/users/:id([0-9]+)/favorites', (req, res) => {
  const userId = req.params['id'];
  const { movieId } = req.body;
  if (!movieId) {
    res
      .status(422)
      .json({ errorCode: 'INVALID_BODY', message: 'movieId is required' });
  }
  const favorite = db.favorites.find(
    (favorite) => favorite.userId === userId && favorite.movieId === movieId
  );
  if (favorite) {
    res.status(409).json({
      errorCode: 'FAVORITE_ALREADY_REGISTER',
      message: 'favorite is already register to user',
    });
  }
  const newFavorite = {
    id: db.favorites.length + 1,
    userId,
    movieId,
  };
  insert(router.db, 'favorites', newFavorite);
  res.status(200).json({
    ...newFavorite,
  });
  return;
});

server.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email) {
    res
      .status(422)
      .json({ errorCode: 'INVALID_BODY', message: 'email is required' });
  } else if (!password) {
    res
      .status(422)
      .json({ errorCode: 'INVALID_BODY', message: 'password is required' });
  } else if (!name) {
    res
      .status(422)
      .json({ errorCode: 'INVALID_BODY', message: 'name is required' });
  }
  const user = db.users.find((user) => user.email === email);
  if (user) {
    res.status(409).json({
      errorCode: 'USER_ALREADY_REGISTER',
      message: 'User is already register',
    });
  }
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password,
  };
  insert(router.db, 'users', newUser);
  delete newUser.password;
  const token = createJwtToken(newUser);
  res.status(200).json({
    token,
  });
  return;
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
