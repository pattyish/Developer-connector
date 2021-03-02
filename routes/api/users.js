const express = require('express');
const config = require('config');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const { throws } = require('assert');
const { errorMonitor } = require('events');

// @route  Post/Users
// @desc   Register User
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Please Enter a Valid Email!!!').isEmail(),
    check(
      'password',
      'Please Enter Password with 6 or More Characters!!!',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'User Already Exist!!!' }],
        });
      }
      // Get User avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: user.id,
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
    //   res.status(200).send('User Registered Successfull!!!!');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
