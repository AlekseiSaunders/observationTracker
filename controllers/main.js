const Observation = require('../models/Observation');

exports.getIndex = (req, res) => {
  res.render('login', { layout: 'login' });
};

exports.getDashboard = async (req, res) => {
  try {
    const observations = await Observation.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.firstName,
      observations,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
};
