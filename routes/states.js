const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/statesController');

// Serve index.html for root or /index.html
router.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/', controller.getAllStates);
router.get('/:state', controller.getState);
router.get('/:state/funfact', controller.getRandomFunFact);
router.get('/:state/capital', controller.getCapital);
router.get('/:state/nickname', controller.getNickname);
router.get('/:state/population', controller.getPopulation);
router.get('/:state/admission', controller.getAdmission);

router.post('/:state/funfact', controller.createFunFact);
router.patch('/:state/funfact', controller.updateFunFact);
router.delete('/:state/funfact', controller.deleteFunFact);

module.exports = router;
