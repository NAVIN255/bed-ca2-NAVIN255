const pool = require("../services/db");

///////////////////////////////////////////////////////
// Select all spells
///////////////////////////////////////////////////////
module.exports.selectAll = (callback) => {
    const sql = `
        SELECT spell_id, name, skillpoint_required
        FROM SpellShop
        ORDER BY spell_id ASC;
    `;
    pool.query(sql, callback);
};

///////////////////////////////////////////////////////
// Select spell by ID
///////////////////////////////////////////////////////
module.exports.selectById = (data, callback) => {
    const sql = `
        SELECT spell_id, name, skillpoint_required
        FROM SpellShop
        WHERE spell_id = ?;
    `;
    pool.query(sql, [data.spell_id], callback);
};

///////////////////////////////////////////////////////
// Insert new spell
///////////////////////////////////////////////////////
module.exports.insertSingle = (data, callback) => {
    const sql = `
        INSERT INTO SpellShop (name, skillpoint_required)
        VALUES (?, ?);
    `;
    pool.query(sql, [data.name, data.skillpoint_required], callback);
};

///////////////////////////////////////////////////////
// Update spell
///////////////////////////////////////////////////////
module.exports.updateById = (data, callback) => {
    const sql = `
        UPDATE SpellShop
        SET name = ?, skillpoint_required = ?
        WHERE spell_id = ?;
    `;
    pool.query(
        sql,
        [data.name, data.skillpoint_required, data.spell_id],
        callback
    );
};

///////////////////////////////////////////////////////
// Delete spell
///////////////////////////////////////////////////////
module.exports.deleteById = (data, callback) => {
    const sql = `
        DELETE FROM SpellShop
        WHERE spell_id = ?;
    `;
    pool.query(sql, [data.spell_id], callback);
};

///////////////////////////////////////////////////////
// Search spells by skillpoints
///////////////////////////////////////////////////////
module.exports.searchBySkillpoints = (data, callback) => {
    const sql = `
        SELECT spell_id, name, skillpoint_required
        FROM SpellShop
        WHERE skillpoint_required <= ?;
    `;
    pool.query(sql, [data.max_skillpoints], callback);
};

///////////////////////////////////////////////////////
// Get spells owned by user
///////////////////////////////////////////////////////
module.exports.selectUserSpells = (data, callback) => {
  const sql = `
    SELECT 
      s.spell_id,
      s.name,
      s.skillpoint_required,
      us.acquired_at
    FROM UserSpells us
    JOIN SpellShop s ON us.spell_id = s.spell_id
    WHERE us.user_id = ?;
  `;
  require("../services/db").query(sql, [data.user_id], callback);
};
