const model = require("../models/challengeModel");

///////////////////////////////////////////////////////
// Controller to read all fitness challenges
///////////////////////////////////////////////////////
module.exports.readAllChallenges = (req, res, next) =>
{
    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readAllChallenges:", error);
            res.status(500).json(error);
        }
        else{
            res.status(200).json(results);
        }
    };
    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller to read a specific challenge by ID
///////////////////////////////////////////////////////
module.exports.readChallengeById = (req, res, next) =>
{
    let data = {};
    let CODE;

    if(res.locals.inserted_id !== undefined){
        data.challenge_id = res.locals.inserted_id;
        CODE = 201;
    }
    else if(res.locals.updated_id !== undefined){
        data.challenge_id = res.locals.updated_id;
        CODE = 200;
    }
    else{
        data.challenge_id = req.params.challenge_id;
        CODE = 200;
    }

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readChallengeById:", error);
            res.status(500).json(error);
        }
        else{
            if(results.length === 0){
                res.status(404).json({
                    message: "Challenge not found"
                });
                return;
            }
            res.status(CODE).json(results);
        }
    };

    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller to read challenges created by a user
///////////////////////////////////////////////////////
module.exports.readUserChallenges = (req, res, next) =>
{
    const data = {
        creator_id: res.locals.userId
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readUserChallenges:", error);
            res.status(500).json(error);
        }
        else{
            res.status(200).json(results);
        }
    };

    model.readUserChallenges(data, callback);
};

///////////////////////////////////////////////////////
// Controller to create a new fitness challenge
///////////////////////////////////////////////////////
module.exports.createNewChallenge = (req, res) => {
    console.log("Incoming create challenge request");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    // 🔴 Hard guard: body must exist
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Request body missing"
        });
    }

    const { challenge, skillpoints } = req.body;

    if (!challenge || !skillpoints) {
        return res.status(400).json({
            message: "Challenge description or skillpoints missing"
        });
    }

    if (!res.locals.userId) {
        return res.status(401).json({
            message: "User ID not found in token"
        });
    }

    const data = {
        challenge,
        skillpoints,
        creator_id: res.locals.userId
    };

    model.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error creating challenge:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Fitness challenge created successfully",
            challenge_id: results.insertId
        });
    });
};
///////////////////////////////////////////////////////
// Controller to check creator ID of a challenge
///////////////////////////////////////////////////////
module.exports.getChallengeCreatorId = (req, res, next) =>
{
    if(req.body.challenge_id === undefined){
        res.status(400).json({
            message: "challenge_id is undefined"
        });
        return;
    }

    const data = {
        challenge_id: req.body.challenge_id
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error getChallengeCreatorId:", error);
            res.status(500).json(error);
        }
        else{
            if(results.length === 0){
                res.status(404).json({
                    message: "Challenge does not exist"
                });
                return;
            }

            if(results[0].creator_id !== res.locals.userId){
                res.status(403).json({
                    message: "You are not the creator of this challenge"
                });
                return;
            }

            res.locals.creator_id = results[0].creator_id;
            next();
        }
    };

    model.getChallengeCreatorId(data, callback);
};

///////////////////////////////////////////////////////
// Controller to update a challenge by ID
///////////////////////////////////////////////////////
module.exports.updateChallengeById = (req, res, next) =>
{
    if(req.body.challenge === undefined || req.body.skillpoints === undefined){
        return res.status(400).json({ message: "Missing challenge or skillpoints" });
    }

    const data = {
        challenge_id: req.params.challenge_id, // ✅ use params
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints
    };

    model.updateById(data, (error, results) => {
        if(error) return res.status(500).json(error);
        if(results.affectedRows === 0) return res.status(404).json({ message: "Challenge not found" });
        res.status(200).json({ message: "Challenge updated successfully" });
    });
};
///////////////////////////////////////////////////////
// Controller to delete a challenge by ID
///////////////////////////////////////////////////////
module.exports.deleteChallengeById = (req, res, next) =>
{
    const data = {
        challenge_id: req.params.challenge_id // ✅ use params
    };

    model.deleteById(data, (error, results) => {
        if(error) return res.status(500).json(error);
        if(results.affectedRows === 0) return res.status(404).json({ message: "Challenge not found" });
        res.status(200).json({ message: "Challenge deleted successfully" });
    });
};

///////////////////////////////////////////////////////
// Controller to validate user & challenge existence
///////////////////////////////////////////////////////
module.exports.checkUserAndChallenge = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        challenge_id: req.params.challenge_id
    };

    model.checkId(data, (error, results) => {
        if (error) {
            console.error("Error checkUserAndChallenge:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User or challenge does not exist"
            });
        }

        next();
    });
};

///////////////////////////////////////////////////////
// Controller to create a completion for a challenge
///////////////////////////////////////////////////////
module.exports.createNewCompletion = (req, res, next) =>
{
    if(req.body.notes === undefined || req.body.review_amt === undefined){
        res.status(400).json({
            message: "Completion notes or review stars missing"
        });
        return;
    }

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.userId,
        completed: req.body.completed,
        review_amt: req.body.review_amt,
        creation_date: new Date(),
        notes: req.body.notes
    };

    const callback = (error, results, fields) =>
    {
        if(error){
           if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "You have already completed this challenge"
        });
    }

    console.error("Error createNewCompletion:", error);
    return res.status(500).json({
        message: "Failed to complete challenge"
    });
        }
        else{
            res.locals.completeId = results.insertId;
            next();
        }
    };

    model.insertCompletion(data, callback);
};

///////////////////////////////////////////////////////
// Controller to read skillpoints for a challenge
///////////////////////////////////////////////////////
module.exports.readChallengeSkillpoints = (req, res, next) =>
{
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.userId
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readChallengeSkillpoints:", error);
            res.status(500).json(error);
        }
        else{
            res.locals.challengePoints = results[0].challenge_skillpoints;
            res.locals.currentPoints = results[0].current_skillpoints;
            next();
        }
    };

    model.selectSkillpoints(data, callback);
};

///////////////////////////////////////////////////////
// Controller to update user's skillpoints after completion
///////////////////////////////////////////////////////
module.exports.updateUserSkillpoints = (req, res, next) =>
{
    let totalPoints;

    if(req.body.completed === false){
        totalPoints = res.locals.currentPoints + 5;
    }
    else{
        totalPoints = res.locals.currentPoints + res.locals.challengePoints;
    }

    const data = {
        user_id: res.locals.userId,
        totalPoints: totalPoints
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error updateUserSkillpoints:", error);
            res.status(500).json(error);
        }
        else{
            next();
        }
    };

    model.updateUserSkillpoints(data, callback);
};

///////////////////////////////////////////////////////
// Controller to read completion by completion ID
///////////////////////////////////////////////////////
module.exports.readCompletionById = (req, res, next) =>
{
    const data = {
        completed_id: res.locals.completeId
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readCompletionById:", error);
            res.status(500).json(error);
        }
        else{
            results[0].completed = req.body.completed;
            res.status(201).json(results);
        }
    };

    model.selectCompletionById(data, callback);
};

///////////////////////////////////////////////////////
// Controller to read completions by challenge ID
///////////////////////////////////////////////////////
module.exports.readCompletionByChallengeId = (req, res, next) =>
{
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results, fields) =>
    {
        if(error){
            console.error("Error readCompletionByChallengeId:", error);
            res.status(500).json(error);
        }
        else{
            if(results.length === 0){
                res.status(404).json({
                    message: "No completions found for this challenge"
                });
                return;
            }

            for(let i = 0; i < results.length; i++){
                results[i].completed = results[i].completed === 1;
            }

            res.status(200).json(results);
        }
    };

    model.selectCompletionByChallengeId(data, callback);
};

module.exports.readActiveChallengesForUser = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  const callback = (err, results) => {
    if (err) {
      console.error("Error readActiveChallengesForUser:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  };

  model.selectActiveChallengesForUser(data, callback);
};

///////////////////////////////////////////////////////
// Get completed challenge count for current user
///////////////////////////////////////////////////////
module.exports.getCompletedCount = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getCompletedCount:", error);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({
      completedChallenges: results[0].completedCount
    });
  };

  require("../models/challengeModel")
    .countCompletedChallengesForUser(data, callback);
};