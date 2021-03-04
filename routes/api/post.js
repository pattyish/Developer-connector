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
    if (!post) {
      return res.status(400).json({
        msg: 'Post not found!!',
      });
    }
    res.status(200).json({
      msg: 'All Posts',
      post,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Delete api/posts/:id
// @desc   Delete Post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found!!' });
    }
    // check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorize!!',
      });
    }
    await post.remove();
    res.status(200).json({
      msg: 'Post Deleted!!',
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Post you are trying to delete not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Put api/posts/like:id
// @desc   Like Post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if user have been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        msg: 'Post already Liked!!',
      });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json({
      msg: 'Successful Like!!',
      likes: post.likes,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Post you are trying to like is not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Put api/posts/unlike:id
// @desc   Unlike Post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if user have been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        msg: 'Post has been not yet liked!!',
      });
    }
    // Get index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.status(200).json({
      msg: 'Successful unLike!!',
      likes: post.likes,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Post you are trying to like is not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
module.exports = router;
