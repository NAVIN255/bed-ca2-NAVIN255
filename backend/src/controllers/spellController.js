const spellModel = require("../models/spellModel");
const db = require("../services/db");

///////////////////////////////////////////////////////
// Read all spells
///////////////////////////////////////////////////////
module.exports.readAllSpells = (req, res) => {
  spellModel.selectAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

///////////////////////////////////////////////////////
// Buy spell (PERMANENT UNLOCK, NO COST)
///////////////////////////////////////////////////////
module.exports.buySpell = (req, res) => {
  const userId = res.locals.userId;
  const { spell_id } = req.body;

  if (!spell_id) {
    return res.status(400).json({ message: "spell_id required" });
  }

  // 1️⃣ Check if spell exists
  spellModel.selectById({ spell_id }, (err, spells) => {
    if (err) return res.status(500).json(err);
    if (!spells.length) {
      return res.status(404).json({ message: "Spell not found" });
    }

    // 2️⃣ Check if user already owns spell
    const checkOwnershipSql = `
      SELECT user_spell_id
      FROM UserSpells
      WHERE user_id = ? AND spell_id = ?
    `;

    db.query(checkOwnershipSql, [userId, spell_id], (err, owned) => {
      if (err) return res.status(500).json(err);

      if (owned.length) {
        return res.status(409).json({
          message: "You already own this spell"
        });
      }

      // 3️⃣ Insert ownership (NO skillpoint deduction)
      const insertSql = `
        INSERT INTO UserSpells (user_id, spell_id)
        VALUES (?, ?)
      `;

      db.query(insertSql, [userId, spell_id], (err) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
          message: "Spell unlocked permanently"
        });
      });
    });
  });
};

///////////////////////////////////////////////////////
// Activate spell (COSTS POINTS, 3 USES)
///////////////////////////////////////////////////////
module.exports.activateSpell = (req, res) => {
  const userId = res.locals.userId;
  const { spell_id } = req.body;

  if (!spell_id) {
    return res.status(400).json({ message: "spell_id required" });
  }

  // 1️⃣ Check ownership
  const ownershipSql = `
    SELECT us.user_spell_id, s.skillpoint_required
    FROM UserSpells us
    JOIN SpellShop s ON us.spell_id = s.spell_id
    WHERE us.user_id = ? AND us.spell_id = ?
  `;

  db.query(ownershipSql, [userId, spell_id], (err, owned) => {
    if (err) return res.status(500).json(err);

    if (!owned.length) {
      return res.status(403).json({
        message: "You do not own this spell"
      });
    }

    const activationCost = owned[0].skillpoint_required;

    // 2️⃣ Check user points
    db.query(
      "SELECT skillpoints FROM User WHERE user_id = ?",
      [userId],
      (err, users) => {
        if (err) return res.status(500).json(err);

        const currentPoints = users[0].skillpoints;

        if (currentPoints < activationCost) {
          return res.status(403).json({
            message: "Not enough skillpoints to activate spell"
          });
        }

        // 3️⃣ Deduct points + activate spell
        const activateSql = `
          UPDATE User
          SET 
            skillpoints = skillpoints - ?,
            active_spell_id = ?,
            active_spell_uses = 3
          WHERE user_id = ?
        `;

        db.query(
          activateSql,
          [activationCost, spell_id, userId],
          (err) => {
            if (err) return res.status(500).json(err);

            res.status(200).json({
              message: "Spell activated (3 uses)",
              remainingPoints: currentPoints - activationCost
            });
          }
        );
      }
    );
  });
};

///////////////////////////////////////////////////////
// Read spells owned by current user
///////////////////////////////////////////////////////
module.exports.readUserSpells = (req, res) => {
  const userId = res.locals.userId;

  const sql = `
    SELECT 
      s.spell_id,
      s.name,
      s.skillpoint_required
    FROM UserSpells us
    JOIN SpellShop s ON us.spell_id = s.spell_id
    WHERE us.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Read user spells error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
};
