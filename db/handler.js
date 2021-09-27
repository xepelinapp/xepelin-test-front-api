const insert = (db, collection, data) => {
    const table = db.get(collection);
    if (_.isEmpty(table.find(data).value())) {
        table.push(data).write();
    }
};

module.exports = {
    insert
}
