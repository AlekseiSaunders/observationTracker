const passport = require('passport');

exports.getGoogleLogin = passport.authenticate('google', {
  scope: ['profile'],
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
};
