const express = require('express');
const router = express.Router();

// @route  api/Posts
// @desc   Test route
// @access Public 
router.get('/', (req, res) => {
    res.send('Testing apis');
  });

module.exports = router;
