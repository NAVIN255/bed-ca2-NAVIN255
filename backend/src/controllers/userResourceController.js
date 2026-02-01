const model = require("../models/userResourceModel");

///////////////////////////////////////////////////////
// Controller: Read all user resources
///////////////////////////////////////////////////////
module.exports.readAllUserResources = (req, res, next) => {
    const callback = (error, results) => {
        if(error){
            console.error("Error readAllUserResources:", error);
            res.status(500).json(error);
            return;
        }
        console.log("User resources retrieved:", results.length);
        res.status(200).json(results);
    }
    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller: Read user resources by user ID
///////////////////////////////////////////////////////
module.exports.readUserResourcesByUserId = (req, res, next) => {
    const data = { user_id: req.params.user_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error readUserResourcesByUserId:", error);
            res.status(500).json(error);
            return;
        }
        console.log(`Resources for user ${data.user_id}:`, results.length);
        res.status(200).json(results);
    }
    model.selectByUserId(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Add new resource to user
///////////////////////////////////////////////////////
module.exports.addUserResource = (req, res) => {
    const data = {
        resource_name: req.body.resource_name,
        user_id: res.locals.userId, // ✅ FROM JWT
        quantity: req.body.quantity
    };

    model.insertSingle(data, (error) => {
        if (error) {
            console.error("Error addUserResource:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Resource added successfully"
        });
    });
};

///////////////////////////////////////////////////////
// Controller: Update user resource
///////////////////////////////////////////////////////
module.exports.updateUserResourceById = (req, res, next) => {
    const data = {
        user_resource_id: req.params.user_resource_id,
        quantity: req.body.quantity
    };
    const callback = (error, results) => {
        if(error){
            console.error("Error updateUserResourceById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "User resource not found" });
            return;
        }
        console.log("User resource updated:", data);
        res.status(200).json({ message: "User resource updated successfully" });
    }
    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete user resource
///////////////////////////////////////////////////////
module.exports.deleteUserResourceById = (req, res, next) => {
    const data = { user_resource_id: req.params.user_resource_id };
    const callback = (error, results) => {
        if(error){
            console.error("Error deleteUserResourceById:", error);
            res.status(500).json(error);
            return;
        }
        if(results.affectedRows === 0){
            res.status(404).json({ message: "User resource not found" });
            return;
        }
        console.log("User resource deleted:", data.user_resource_id);
        res.status(204).send();
    }
    model.deleteById(data, callback);
};
