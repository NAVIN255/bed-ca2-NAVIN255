const express = require('express');
const router = express.Router();

const spellController = require('../controllers/spellController');
const jwtMiddleware = require('../middleware/authMiddleware');

router.use(jwtMiddleware.verifyToken);

// Search by skillpoints
router.get('/search/skillpoints', spellController.searchSpellsBySkillpoints);


router.get('/', spellController.readAllSpells);
router.get('/:spell_id', spellController.readSpellById);
router.post('/', spellController.createNewSpell);
router.put('/:spell_id', spellController.updateSpellById);
router.delete('/:spell_id', spellController.deleteSpellById);

module.exports = router;
