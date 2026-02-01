const model = require("../models/resourceModel");

///////////////////////////////////////////////////////
// Controller: Read user resources
///////////////////////////////////////////////////////
module.exports.readUserResources = (req, res, next) =>
{
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readUserResources:", error);
            res.status(500).json(error);
            return;
        }

        res.status(200).json(results);
    };

    model.selectByUserId(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Add resource
///////////////////////////////////////////////////////
module.exports.addUserResource = (req, res, next) =>
{
    const data = {
        resource_id: req.body.resource_id,
        user_id: req.body.user_id,
        name: req.body.name,
        quantity: req.body.quantity
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error addUserResource:", error);
            res.status(500).json(error);
            return;
        }

        res.status(201).json({
            message: "Resource added"
        });
    };

    model.insertSingle(data, callback);
};
