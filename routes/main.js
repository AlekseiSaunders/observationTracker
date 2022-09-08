const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const mainController = require('../controllers/main');

// @desc Login/Landing page
// @route GET /

router.get('/', ensureGuest, mainController.getIndex);

// @desc Dashboard
// @route GET /dashboard
// The lean method on the end of the story retrieval by user.id returns a javascript object, not a mongoose document
// This is needed to allow for the use of the returned data to be used in the handlebars template
router.get('/dashboard', ensureAuth, mainController.getDashboard);

module.exports = router;
