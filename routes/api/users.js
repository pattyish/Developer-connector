const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    res.send('Testing apis');
  },
);

module.exports = router;
