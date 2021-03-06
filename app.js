require("dotenv").config();
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./db/db.json");
const db = require("./db/db.json");
const { insert, remove } = require("./db/handler");
const middlewares = jsonServer.defaults();
const checkJwt = require("./middlewares/auth");
const handlerError = require("./middlewares/error");
const delay = require("./middlewares/delay");
const { createJwtToken } = require("./helper/auth");

server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(handlerError);
server.use(delay);
server.use(checkJwt);

const generateId = () => {
  return new Date().getTime();
};

server.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "email is required" });
    return;
  } else if (!password) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "password is required" });
    return;
  } else if (!name) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "name is required" });
    return;
  }
  const user = db.users.find((user) => user.email === email);
  if (user) {
    res.status(409).json({
      errorCode: "USER_ALREADY_REGISTERED",
      message: "User is already registered",
    });
    return;
  }
  const newUser = {
    id: generateId(),
    name,
    email,
    password,
  };
  insert(router.db, "users", newUser);
  delete newUser.password;
  const token = createJwtToken(newUser);
  res.status(201).json({
    ...newUser,
    token,
  });
  return;
});

server.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "email is required" });
    return;
  } else if (!password) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "password is required" });
    return;
  }

  const user = db.users.find((user) => user.email === email);
  if (!user) {
    res.status(401).json({
      message: "Invalid credentials",
      errorCode: "LOGIN_ERROR_INVALID_CREDENTIALS",
    });
    return;
  }
  if (password !== user.password) {
    res.status(401).json({
      message: "Invalid credentials",
      errorCode: "LOGIN_ERROR_INVALID_CREDENTIALS",
    });
    return;
  }
  delete user.password;
  const token = createJwtToken(user);
  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  });
  return;
});

server.get("/favorites", (req, res) => {
  const { id: userId } = req.user;
  const favorites = db.favorites.filter(
    (favorite) => favorite.userId === userId
  );
  res.status(200).json(favorites);
  return;
});

server.post("/favorites", (req, res) => {
  const { id: userId } = req.user;
  const { movieId } = req.body;
  if (!movieId) {
    res
      .status(422)
      .json({ errorCode: "INVALID_BODY", message: "movieId is required" });
    return;
  }
  const favorite = db.favorites.find(
    (favorite) => favorite.userId === userId && favorite.movieId === movieId
  );
  if (favorite) {
    res.status(409).json({
      errorCode: "FAVORITE_ALREADY_REGISTERED",
      message: "Favorite movie is already registered to user",
    });
    return;
  }
  const newFavorite = {
    id: generateId(),
    userId,
    movieId,
  };
  insert(router.db, "favorites", newFavorite);
  res.status(200).json({
    ...newFavorite,
  });
  return;
});

server.delete("/favorites/:favoriteId([0-9]+)", (req, res) => {
  const { id: userId } = req.user;
  const { favoriteId: rawFavoriteId } = req.params;
  const favoriteId = parseInt(rawFavoriteId);

  const favorite = db.favorites.find(
    (favorite) => favorite.userId === userId && favorite.id === favoriteId
  );
  if (!favorite) {
    res.status(404).json({
      errorCode: "ERROR_FAVORITE_NOT_FOUND",
      message: "Favorite not found for this user",
    });
    return;
  }

  remove(router.db, "favorites", favoriteId);

  res.status(204).json({});
  return;
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
