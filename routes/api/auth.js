const express = require('express');
const router = express.Router();
const auth = require('../../middleware/Auth');

const User = require('../../models/User');

// @route  Api/Auth
// @desc   Test route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error!!');
  }
});

module.exports = router;
