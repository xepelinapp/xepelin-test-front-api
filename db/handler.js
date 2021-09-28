const insert = (db, collection, data) => {
  const table = db.get(collection);
  table.push(data).write();
};

module.exports = {
  insert,
};
