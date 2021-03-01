const express = require('express');
const router = express.Router();

// @route  Api/Auth
// @desc   Test route
// @access Public 
router.get('/', (req, res) => {
    res.send('Testing apis');
  });

module.exports = router;
