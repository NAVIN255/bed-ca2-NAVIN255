const db = require("../services/db");

/* ===============================
   AUTH
=============================== */
module.exports.login = (data, callback) => {
  const SQL = `
    SELECT user_id, username, password, skillpoints
    FROM User
    WHERE email = ?;
  `;
  db.query(SQL, [data.email], callback);
};

module.exports.register = (data, callback) => {
  const SQL = `
    INSERT INTO User (email, username, password, skillpoints)
    VALUES (?, ?, ?, ?);
  `;
  db.query(SQL, [
    data.email,
    data.username,
    data.password,
    data.skillpoints
  ], callback);
};

module.exports.checkUsernameOrEmailExist = (data, callback) => {
  const SQL = `
    SELECT user_id FROM User
    WHERE username = ? OR email = ?;
  `;
  db.query(SQL, [data.username, data.email], callback);
};

/* ===============================
   USERS
=============================== */
module.exports.selectAll = (callback) => {
  db.query(
    "SELECT user_id, username, email, skillpoints FROM User;",
    callback
  );
};

module.exports.readUserById = (data, callback) => {
  const SQL = `
    SELECT user_id, username, email, skillpoints
    FROM User
    WHERE user_id = ?;
  `;
  db.query(SQL, [data.user_id], callback);
};

module.exports.updateUserById = (data, callback) => {
  const SQL = `
    UPDATE User
    SET username = ?, skillpoints = ?
    WHERE user_id = ?;
  `;
  db.query(SQL, [
    data.username,
    data.skillpoints,
    data.user_id
  ], callback);
};

module.exports.deleteUserById = (data, callback) => {
  db.query(
    "DELETE FROM User WHERE user_id = ?;",
    [data.user_id],
    callback
  );
};