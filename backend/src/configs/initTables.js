const pool = require('../services/db');
const bcrypt = require('bcrypt');

bcrypt.hash('1234', 10, (err, hash) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  const SQLSTATEMENT = `
  SET FOREIGN_KEY_CHECKS = 0;

  DROP TABLE IF EXISTS UserCompletion;
  DROP TABLE IF EXISTS FitnessChallenge;
  DROP TABLE IF EXISTS UserSpells;
  DROP TABLE IF EXISTS SpellShop;
  DROP TABLE IF EXISTS User;

  SET FOREIGN_KEY_CHECKS = 1;

  -- ======================
  -- USERS (NO FK YET)
  -- ======================
  CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skillpoints INT DEFAULT 0,
    active_spell_id INT NULL,
    active_spell_uses INT DEFAULT 0
  );

  -- ======================
  -- SPELL SHOP
  -- ======================
  CREATE TABLE SpellShop (
    spell_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    skillpoint_required INT NOT NULL
  );

  -- ======================
  -- ADD FK AFTER BOTH TABLES EXIST
  -- ======================
  ALTER TABLE User
    ADD CONSTRAINT fk_user_active_spell
    FOREIGN KEY (active_spell_id)
    REFERENCES SpellShop(spell_id)
    ON DELETE SET NULL;

  -- ======================
  -- USER SPELLS
  -- ======================
  CREATE TABLE UserSpells (
    user_spell_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spell_id INT NOT NULL,
    uses_remaining INT DEFAULT 3,
    is_active BOOLEAN DEFAULT FALSE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, spell_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (spell_id) REFERENCES SpellShop(spell_id) ON DELETE CASCADE
  );

  -- ======================
  -- FITNESS CHALLENGES
  -- ======================
  CREATE TABLE FitnessChallenge (
    challenge_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    challenge TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    skillpoints INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  -- ======================
  -- USER COMPLETIONS
  -- ======================
  CREATE TABLE UserCompletion (
    complete_id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    completed BOOLEAN NOT NULL,
    review_amt INT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE (challenge_id, user_id),
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
  );

  -- ======================
  -- SAMPLE DATA
  -- ======================
  INSERT INTO User (username, email, password) VALUES
  ('Test', 'test@lol.com', '${hash}'),
  ('Admin', 'admin@lol.com', '${hash}');

  INSERT INTO SpellShop (name, skillpoint_required) VALUES
  ('Fireball Charm', 30),
  ('Teleportation Glyph', 200),
  ('Hydra Shield', 300),
  ('Phoenix Flight', 400),
  ('Celestial Grimoire', 500),
  ('Void Arcana', 600),
  ('Archmage Rite', 700);
  `;

  pool.query(SQLSTATEMENT, (error) => {
    if (error) {
      console.error("❌ Error creating tables:", error);
    } else {
      console.log("✅ Tables created successfully (clean core schema)");
    }
    process.exit();
  });
});
