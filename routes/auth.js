const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');

// @desc Auth with Google
// @route GET /auth/google

router.get('/google', authController.getGoogleLogin);

// @desc Google auth callback
// @route GET /auth/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => res.redirect('/dashboard')
);

// @desc Logout user
// @route Get /auth/logout

router.get('/logout', authController.getLogout);

module.exports = router;
