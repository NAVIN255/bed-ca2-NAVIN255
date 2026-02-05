const model = require("../models/userModels");


///////////////////////////////////////////////////////
// GAMIFICATION HELPERS
///////////////////////////////////////////////////////
const calculateLevel = (points) => {
  return Math.floor(points / 100) + 1;
};

const calculateBadges = (points) => {
  const badges = [];

  if (points >= 50) badges.push("Beginner");
  if (points >= 150) badges.push("Consistent");
  if (points >= 300) badges.push("Challenger");
  if (points >= 600) badges.push("Wellness Master");

  return badges;
};

///////////////////////////////////////////////////////
// Controller: User Login
///////////////////////////////////////////////////////
module.exports.login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Email or password is missing"
        });
    }

    const data = {
        email: req.body.email
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error login:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 🔑 REQUIRED FOR MIDDLEWARE CHAIN
        res.locals.userId = results[0].user_id;
        res.locals.username = results[0].username;
        res.locals.hash = results[0].password;

        next(); // → bcrypt.comparePassword
    };

    model.login(data, callback);
};
///////////////////////////////////////////////////////
// Controller: Register New User
///////////////////////////////////////////////////////
module.exports.register = (req, res, next) =>
{
    const data = {
        email: req.body.email,
        password: res.locals.hash,
        username: req.body.username,
        skillpoints: 0
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error register:", error);
            res.status(500).json(error);
            return;
        }

        res.locals.message = `User ${data.username} created successfully`;
        res.locals.userId = results.insertId;
        next();
    };

    model.register(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Check Username or Email Exists
///////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req, res, next) =>
{
    const data = {
        email: req.body.email,
        username: req.body.username
    };

    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error checkUsernameOrEmailExist:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length !== 0) {
            res.status(409).json({
                message: "Username or email already exists"
            });
            return;
        }

        next();
    };

    model.checkUsernameOrEmailExist(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Read All Users
///////////////////////////////////////////////////////
module.exports.readAllUsers = (req, res, next) =>
{
    const callback = (error, results, fields) =>
    {
        if (error) {
            console.error("Error readAllUsers:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    model.selectAll(callback);
};


///////////////////////////////////////////////////////
// Controller: Update User By ID
///////////////////////////////////////////////////////
module.exports.updateUserById = (req, res) =>
{
    if (req.body.username === undefined) {
        return res.status(400).json({
            message: "username is undefined"
        });
    }

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error updateUserById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ✅ SEND RESPONSE HERE
        res.status(200).json({
            user_id: data.user_id,
            username: data.username,
            skillpoints: data.skillpoints
        });
    };

    model.updateUserById(data, callback);
};


///////////////////////////////////////////////////////
// Controller: Delete User By ID
///////////////////////////////////////////////////////
module.exports.deleteUserById = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteUserById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(204).send(); // No Content
    };

    model.deleteUserById(data, callback);
};

////////////////////////////////////////////////////////
// Controller: Get current user profile (WITH LEVELS & BADGES)
///////////////////////////////////////////////////////
module.exports.getProfile = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  model.readUserById(data, (error, results) => {
    if (error) {
      console.error("getProfile error:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const points = user.skillpoints || 0;

    res.status(200).json({
      ...user,
      level: calculateLevel(points),
      badges: calculateBadges(points)
    });
  });
};

///////////////////////////////////////////////////////
// Read full profile (with spells)
///////////////////////////////////////////////////////
module.exports.readFullProfile = (data, callback) => {
  const sql = `
    SELECT 
      u.user_id,
      u.username,
      u.email,
      u.skillpoints,
      u.active_spell_id,
      u.active_spell_uses,
      s.name AS active_spell_name
    FROM User u
    LEFT JOIN SpellShop s ON u.active_spell_id = s.spell_id
    WHERE u.user_id = ?;
  `;
  require("../services/db").query(sql, [data.user_id], callback);
};
