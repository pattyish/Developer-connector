const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
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
router.post(
  '/',
  [
    check('email', 'Please Enter a Valid Email!!!').isEmail(),
    check('password', 'Password is required!!!').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Incorrect Password Or Email!!!' }],
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Incorrect Password Or Email!!!' }],
        });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('secretKey'),
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        },
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  },
);

module.exports = router;
