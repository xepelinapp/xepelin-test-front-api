const insert = (db, collection, data) => {
  const table = db.get(collection);
  table.push(data).write();
};

const remove = (db, collection, id) => {
  const table = db.get(collection);
  table.remove({ id }).write();
};

module.exports = {
  insert,
  remove,
};
