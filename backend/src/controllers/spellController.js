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
// Buy spell (deduct points + unlock)
///////////////////////////////////////////////////////
module.exports.buySpell = (req, res) => {
  const userId = res.locals.userId;
  const { spell_id } = req.body;

  if (!spell_id) {
    return res.status(400).json({ message: "spell_id required" });
  }

  // 1️⃣ Get spell
  spellModel.selectById({ spell_id }, (err, spells) => {
    if (err) return res.status(500).json(err);
    if (!spells.length) {
      return res.status(404).json({ message: "Spell not found" });
    }

    const spell = spells[0];

    // 2️⃣ Get user points
    db.query(
      "SELECT skillpoints FROM User WHERE user_id = ?",
      [userId],
      (err, users) => {
        if (err) return res.status(500).json(err);

        const points = users[0].skillpoints;

        if (points < spell.skillpoint_required) {
          return res.status(403).json({
            message: "Not enough skillpoints"
          });
        }

        // 3️⃣ Deduct points + store ownership
        db.query(
          `
          UPDATE User
          SET skillpoints = skillpoints - ?
          WHERE user_id = ?;

          INSERT INTO UserSpells (user_id, spell_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE acquired_at = CURRENT_TIMESTAMP;
          `,
          [spell.skillpoint_required, userId, userId, spell_id],
          () => {
            res.status(200).json({
              message: "Spell purchased successfully",
              remainingPoints: points - spell.skillpoint_required
            });
          }
        );
      }
    );
  });
};

///////////////////////////////////////////////////////
// Activate spell (3 uses)
///////////////////////////////////////////////////////
module.exports.activateSpell = (req, res) => {
  const userId = res.locals.userId;
  const { spell_id } = req.body;

  if (!spell_id) {
    return res.status(400).json({ message: "spell_id required" });
  }

  const sql = `
    UPDATE User
    SET active_spell_id = ?, active_spell_uses = 3
    WHERE user_id = ?;
  `;

  db.query(sql, [spell_id, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      message: "Spell activated (3 uses)"
    });
  });
};
