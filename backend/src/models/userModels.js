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

///////////////////////////////////////////////////////
// Read user by ID (WITH ACTIVE SPELL INFO)
///////////////////////////////////////////////////////
module.exports.readUserById = (data, callback) => {
  const SQL = `
    SELECT 
      u.user_id,
      u.username,
      u.email,
      u.skillpoints,
      u.active_spell_id,
      u.active_spell_uses,
      s.name AS active_spell_name
    FROM User u
    LEFT JOIN SpellShop s
      ON u.active_spell_id = s.spell_id
    WHERE u.user_id = ?;
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

///////////////////////////////////////////////////////
// Set active spell for user
///////////////////////////////////////////////////////
module.exports.setActiveSpell = (data, callback) => {
  const SQL = `
    UPDATE User
    SET active_spell_id = ?
    WHERE user_id = ?;
  `;
  const VALUES = [data.spell_id, data.user_id];

  db.query(SQL, VALUES, callback);
};

///////////////////////////////////////////////////////
// Get user's active spell
///////////////////////////////////////////////////////
module.exports.getActiveSpell = (data, callback) => {
  const SQL = `
    SELECT s.*
    FROM SpellShop s
    JOIN User u ON u.active_spell_id = s.spell_id
    WHERE u.user_id = ?;
  `;

  db.query(SQL, [data.user_id], callback);
};

///////////////////////////////////////////////////////
// Get user's current skillpoints
///////////////////////////////////////////////////////
module.exports.getUserSkillpoints = (data, callback) => {
  const SQL = `
    SELECT skillpoints
    FROM User
    WHERE user_id = ?;
  `;
  db.query(SQL, [data.user_id], callback);
};

///////////////////////////////////////////////////////
// Deduct skillpoints from user
///////////////////////////////////////////////////////
module.exports.deductSkillpoints = (data, callback) => {
  const SQL = `
    UPDATE User
    SET skillpoints = skillpoints - ?
    WHERE user_id = ?;
  `;
  db.query(SQL, [data.cost, data.user_id], callback);
};

///////////////////////////////////////////////////////
// Add spell to user's owned spells
///////////////////////////////////////////////////////
module.exports.addUserSpell = (data, callback) => {
  const SQL = `
    INSERT INTO UserSpells (user_id, spell_id)
    VALUES (?, ?);
  `;
  db.query(SQL, [data.user_id, data.spell_id], callback);
};

///////////////////////////////////////////////////////
// Check if user already owns a spell
///////////////////////////////////////////////////////
module.exports.checkUserOwnsSpell = (data, callback) => {
  const SQL = `
    SELECT user_spell_id
    FROM UserSpells
    WHERE user_id = ? AND spell_id = ?;
  `;
  db.query(SQL, [data.user_id, data.spell_id], callback);
};
//////////////////////////////////////////////////////
// Decrement active spell use
///////////////////////////////////////////////////////
module.exports.decrementSpellUse = (req, res, next) => {
  const userId = res.locals.userId;

  const SQL = `
    UPDATE User
    SET 
      active_spell_uses = active_spell_uses - 1,
      active_spell_id = CASE 
        WHEN active_spell_uses - 1 <= 0 THEN NULL
        ELSE active_spell_id
      END
    WHERE user_id = ?
      AND active_spell_id IS NOT NULL;
  `;

  db.query(SQL, [userId], err => {
    if (err) {
      console.error("Spell use decrement error:", err);
    }
    next(); // NEVER block challenge completion
  });
};