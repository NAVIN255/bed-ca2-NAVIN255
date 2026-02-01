const model = require("../models/spellModel");

///////////////////////////////////////////////////////
// Controller: Read all spells
///////////////////////////////////////////////////////
module.exports.readAllSpells = (req, res, next) =>
{
    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readAllSpells:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Spells retrieved:", results.length);
        res.status(200).json(results);
    };

    model.selectAll(callback);
};

///////////////////////////////////////////////////////
// Controller: Read spell by ID
///////////////////////////////////////////////////////
module.exports.readSpellById = (req, res, next) =>
{
    const data = { spell_id: req.params.spell_id };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error readSpellById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "Spell not found" });
            return;
        }

        console.log("Spell found:", results[0]);
        res.status(200).json(results[0]);
    };

    model.selectById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Create a new spell
///////////////////////////////////////////////////////
module.exports.createNewSpell = (req, res) =>
{
    const data = {
        name: req.body.name,
        skillpoint_required: req.body.skillpoint_required
    };

    model.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error createNewSpell:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            spell_id: results.insertId,
            name: data.name,
            skillpoint_required: data.skillpoint_required
        });
    });
};

///////////////////////////////////////////////////////
// Controller: Update spell
///////////////////////////////////////////////////////
module.exports.updateSpellById = (req, res, next) =>
{
    const data = {
        spell_id: req.params.spell_id,
        name: req.body.name,
        skillpoint_required: req.body.skillpoint_required
    };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error updateSpellById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Spell not found" });
            return;
        }

        console.log("Spell updated:", data);
        res.status(200).json({ message: "Spell updated successfully" });
    };

    model.updateById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Delete spell
///////////////////////////////////////////////////////
module.exports.deleteSpellById = (req, res, next) =>
{
    const data = { spell_id: req.params.spell_id };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error deleteSpellById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Spell not found" });
            return;
        }

        console.log("Spell deleted:", data.spell_id);
        res.status(204).send();
    };

    model.deleteById(data, callback);
};

///////////////////////////////////////////////////////
// Controller: Search spells by skillpoint requirement
///////////////////////////////////////////////////////
module.exports.searchSpellsBySkillpoints = (req, res, next) =>
{
    const data = { max_skillpoints: req.query.max || 1000 };

    const callback = (error, results) =>
    {
        if (error) {
            console.error("Error searchSpellsBySkillpoints:", error);
            res.status(500).json(error);
            return;
        }

        console.log("Spells found:", results.length);
        res.status(200).json(results);
    };

    model.searchBySkillpoints(data, callback);
};
