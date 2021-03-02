const express = require('express');
const router = express.Router();
const auth = require('../../middleware/Auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  api/Profile/me
// @desc   Test route
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({
        msg: 'There is no profile for this user!!!',
      });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server Error!!' });
  }
});

module.exports = router;
