const pool = require('../services/db');
const bcrypt = require('bcrypt');

bcrypt.hash('1234', 10, (err, hash) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  const SQLSTATEMENT = `
  SET FOREIGN_KEY_CHECKS = 0;

  DROP TABLE IF EXISTS Reviews;
  DROP TABLE IF EXISTS UserSpells;
  DROP TABLE IF EXISTS UserResources;
  DROP TABLE IF EXISTS StudentIngredients;
  DROP TABLE IF EXISTS Ingredients;
  DROP TABLE IF EXISTS ClassEnrollment;
  DROP TABLE IF EXISTS Classes;
  DROP TABLE IF EXISTS StudentSpells;
  DROP TABLE IF EXISTS SpellShop;
  DROP TABLE IF EXISTS Students;
  DROP TABLE IF EXISTS UserCompletion;
  DROP TABLE IF EXISTS FitnessChallenge;
  DROP TABLE IF EXISTS User;

  SET FOREIGN_KEY_CHECKS = 1;

  -- ======================
  -- USERS
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
  -- SPELL SHOP (MASTER DATA)
  -- ======================
  CREATE TABLE SpellShop (
    spell_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    skillpoint_required INT NOT NULL
  );

  -- ======================
  -- USER SPELLS (OWNED + ACTIVE + USAGE)
  -- ======================
  CREATE TABLE UserSpells (
    user_spell_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spell_id INT NOT NULL,
    uses_remaining INT DEFAULT 3,
    is_active BOOLEAN DEFAULT FALSE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, spell_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (spell_id) REFERENCES SpellShop(spell_id)
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
  FOREIGN KEY (creator_id) REFERENCES User(user_id)
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
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  );

  -- ======================
  -- STUDENTS (LEGACY / EXTENSION)
  -- ======================
  CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    magic_exp INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  );

  -- ======================
  -- CLASSES
  -- ======================
  CREATE TABLE Classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    required_spell_id INT NOT NULL,
    min_magic_exp INT NOT NULL,
    FOREIGN KEY (required_spell_id) REFERENCES SpellShop(spell_id)
  );

  -- ======================
  -- CLASS ENROLLMENT
  -- ======================
  CREATE TABLE ClassEnrollment (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    time_enrolled TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
  );

  -- ======================
  -- INGREDIENTS
  -- ======================
  CREATE TABLE Ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    magic_exp INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
  );

  -- ======================
  -- STUDENT INGREDIENTS
  -- ======================
  CREATE TABLE StudentIngredients (
    student_ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id INT NOT NULL,
    student_id INT NOT NULL,
    quantity INT DEFAULT 1,
    UNIQUE (ingredient_id, student_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
  );

  -- ======================
  -- USER RESOURCES
  -- ======================
  CREATE TABLE UserResources (
    user_resource_id INT AUTO_INCREMENT PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    quantity INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  );

  -- ======================
  -- REVIEWS
  -- ======================
  CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    review_amt INT NOT NULL,
    review_text TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
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

  INSERT INTO Classes (name, required_spell_id, min_magic_exp) VALUES
  ('Elemental Studies', 1, 0),
  ('Teleportation Theory', 2, 1000),
  ('Advanced Summoning', 3, 5000);
  `;

  pool.query(SQLSTATEMENT, (error) => {
    if (error) {
      console.error("❌ Error creating tables:", error);
    } else {
      console.log("✅ Tables created successfully (3-use spell system)");
    }
    process.exit();
  });
});
