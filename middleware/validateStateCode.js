const validateStateCode = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
  
    // Validate that the state code is exactly two uppercase letters
    const stateCodeRegex = /^[A-Z]{2}$/;
  
    if (!stateCodeRegex.test(stateCode)) {
      return res.status(400).json({ error: 'Invalid state code format. It must be two uppercase letters.' });
    }
  
    next();
  };
  
  module.exports = validateStateCode;
  