const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/statesController');
const validateStateCode = require('../middleware/validateStateCode'); // Import the middleware

// Route to handle `/states` for getting all states
router.get('/', controller.getAllStates);  // Changed this to '/'

// Apply validation middleware to routes that involve a state code
router.get('/:state', validateStateCode, controller.getState);
router.get('/:state/funfact', validateStateCode, controller.getRandomFunFact);
router.get('/:state/capital', validateStateCode, controller.getCapital);
router.get('/:state/nickname', validateStateCode, controller.getNickname);
router.get('/:state/population', validateStateCode, controller.getPopulation);
router.get('/:state/admission', validateStateCode, controller.getAdmission);

router.post('/:state/funfact', validateStateCode, controller.createFunFact);
router.patch('/:state/funfact', validateStateCode, controller.updateFunFact);
router.delete('/:state/funfact', validateStateCode, controller.deleteFunFact);

// Serve index.html for root or /index.html
router.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = router;

