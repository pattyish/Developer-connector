const express = require('express');
const router = express.Router();
const auth = require('../../middleware/Auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route  Post api/posts
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
// @route  Get api/posts
// @desc   Get All Posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json({
      msg: 'All Posts',
      posts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Get api/posts/:id
// @desc   Get All Posts
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({
        msg: ""
      })
    }
    res.status(200).json({
      msg: 'All Posts',
      post,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Education You are trying to Delete not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
module.exports = router;
