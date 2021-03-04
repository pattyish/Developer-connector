const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Imported
const auth = require('../../middleware/Auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  api/Profile/me
// @desc   Get current user profile
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
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error!!' });
  }
});

// @route  Post api/Profile
// @desc   Create or Update Profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
    } = req.body;
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        );
        return res.status(201).json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.status(201).json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error!!' });
    }
  },
);

// @route  Get api/Profile
// @desc   Get all profile
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.status(200).json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Get api/Profile/id
// @desc   Get profile of current user
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res.status(400).json({ msg: 'There is profile for this user!!' });
    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Delete api/Profile
// @desc   Delete profile, user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove User posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(200).json({ msg: 'User deleted successfull!!!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Put api/Profile/experience
// @desc   Add profile experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required!!!').not().isEmpty(),
      check('company', 'Company is required!!!').not().isEmpty(),
      check('from', 'From date is required!!!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.status(201).json({
        msg: 'Experience Added Successfull!!',
        profile,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error!!' });
    }
  },
);
// @route  Delete api/Profile/experience/:exp_id
// @desc   Delete profile experience
// @access
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(201).json({
      msg: 'Experience Removed Successful!!!',
      profile,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: 'Experience You are trying to Delete not found!!' });
    }
    res.status(500).json({ msg: 'Server Error!!' });
  }
});
// @route  Put api/Profile/education
// @desc   Add profile education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required!!!').not().isEmpty(),
      check('degree', 'Degree is required!!!').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required!!!').not().isEmpty(),
      check('from', 'From date is required!!!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();
      res.status(201).json({
        msg: 'Education Added Successfull!!',
        profile,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error!!' });
    }
  },
);
// @route  Delete api/Profile/education/:educ_id
// @desc   Delete profile education
// @access
router.delete('/education/:educ_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.educ_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.status(201).json({
      msg: 'Education Removed Successful!!!',
      profile,
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
