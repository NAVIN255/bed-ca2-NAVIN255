// Example: check if the logged-in user is owner of a resource
module.exports.checkOwnership = (req, res, next) => {
    const userId = req.user.user_id; // from JWT
    const ownerId = req.body.user_id || req.params.user_id;

    if (parseInt(userId) !== parseInt(ownerId)) {
        return res.status(403).json({ message: "You do not have permission" });
    }

    next();
};
