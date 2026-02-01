// Generic validation middleware
module.exports.validateBody = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length) {
        return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
    }
    next();
};
