const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Hash password before registration
module.exports.hashPassword = async (req, res, next) => {
    if (!req.body.password) return res.status(400).json({ message: "Password missing" });
    try {
        const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        res.locals.hash = hash;
        next();
    } catch (err) {
        console.error("Error hashing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Compare password during login
module.exports.comparePassword = async (req, res, next) => {
    const { password } = req.body;
    const hash = res.locals.hash;

    if (!password || !hash) return res.status(400).json({ message: "Missing password or hash" });

    try {
        const match = await bcrypt.compare(password, hash);
        if (!match) return res.status(401).json({ message: "Password incorrect" });
        next();
    } catch (err) {
        console.error("Error comparing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
