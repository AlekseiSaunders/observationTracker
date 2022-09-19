const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { ensureAuth } = require('../middleware/auth');
const observationController = require('../controllers/observation');

// @desc Show all observations
// @route GET /observations

router.get('/', ensureAuth, observationController.getObservations);

// @desc Show add page
// @route GET /observations/add

router.post(
  '/',
  upload.single('file'),
  ensureAuth,
  observationController.processObservation
);

// @desc Process add form
// @route POST /observations

router.get('/add', ensureAuth, observationController.addObservation);

// @desc Show single observation
// @route GET /observations/:id

router.get('/:id', ensureAuth, observationController.showSingleObservation);

// @desc Show edit page
// @route GET /observations/edit/:id

router.get('/edit/:id', ensureAuth, observationController.editObservation);

// @desc Update observation
// @route PUT /observations/:id

router.put('/:id', ensureAuth, observationController.updateObservation);

// @desc Delete observation
// @route DELETE /observation/:id

router.delete('/:id', ensureAuth, observationController.deleteObservation);

// @desc Show user observations
// @route GET /observations/user/:userId

router.get(
  '/user/:userId',
  ensureAuth,
  observationController.showUserObservations
);

module.exports = router;
