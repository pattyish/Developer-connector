const express = require('express');
const router = express.Router();
const auth = require('../../middleware/Auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route  api/posts
// @desc   Create Post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required!!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const text = req.body.text;
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.status(201).json({
        msg: 'Post created successfull!!',
        post,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error!!' });
    }
  },
);

module.exports = router;
