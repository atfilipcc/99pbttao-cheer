const express = require('express');
const passport = require('passport');
const router = express.Router();
const frontEndUri = process.env.FRONT_END_URI || 'http://localhost:3000';
const User = require('../models/User');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.user)
    res.cookie('session', req.sessionID, {
      maxAge: 3600000 * 3,
      httpOnly: true,
    });
    res.cookie('loggedInUser', req.user.userId, {
      maxAge: 3600000 * 3,
      httpOnly: false,
    })
    res.redirect(frontEndUri);
  }
);

router.get('/logout', (req, res) => {
  console.log(req.sessionID);
  req.session.destroy();
  req.logout();
  res.clearCookie('session');
  res.redirect(frontEndUri);
});

module.exports = router;
