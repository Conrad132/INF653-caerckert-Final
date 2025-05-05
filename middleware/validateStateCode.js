const stateData = require('../model/statesData.json'); 

const validateStateCode = (req, res, next) => {
  const stateCode = req.params.state.toUpperCase();

  // Check format: 2 uppercase letters
  const stateCodeRegex = /^[A-Z]{2}$/;
  if (!stateCodeRegex.test(stateCode)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  // Check if the state code exists
  const validState = stateData.find(state => state.code === stateCode);
  if (!validState) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  // Attach normalized code if needed later
  req.params.state = stateCode;

  next();
};

module.exports = validateStateCode;