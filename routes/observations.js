const { request } = require('express');
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Observation = require('../models/Observation');

// @desc Show all stories
// @route GET /stories

router.get('/', ensureAuth, async (req, res) => {
  try {
    const observations = await Observation.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('observations/index', { observations });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc Show add page
// @route GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
  res.render('observations/add');
});

// @desc Show single story
// @route GET /stories/:id

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let observation = await Observation.findById(req.params.id)
      .populate('user')
      .lean();
    if (!observation) {
      return res.render('error/404');
    }
    res.render('observations/show', {
      observation,
    });
  } catch (error) {
    console.error(error);
    return res.render('error/404');
  }
});

// @desc Process add form
// @route POST /stories

router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Observation.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc Show edit page
// @route GET /stories/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const observation = await Observation.findOne({
      _id: req.params.id,
    }).lean();
    if (!observation) {
      return res.render('error/404');
    }
    if (observation.user != req.user.id) {
      res.redirect('/observation');
    } else {
      res.render('observations/edit', {
        observation,
      });
    }
  } catch (error) {
    console.error(error);
    return res.render('error/500');
  }
});

// @desc Update story
// @route PUT /stories/:id

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let observation = await Observation.findById(req.params.id).lean();
    if (!observation) {
      return res.render('error/404');
    }
    if (observation.user != req.user.id) {
      res.redirect('/observations');
    } else {
      observation = await Observation.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    return res.redirect('error/500');
  }
});

// @desc Delete story
// @route DELETE /stories/:id

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Observation.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    return res.render('error/500');
  }
});

// @desc Show user stories
// @route GET /stories/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const observations = await Observation.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    res.render('observations/index', {
      observations,
    });
  } catch (error) {
    console.error(error);
    res.redirect('error/500');
  }
});

module.exports = router;
