const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:id', async (req, res) => {
	if (req.isAuthenticated()) {
		const loggedInUser = await User.findOne({ userId: req.params.id });
		res.send(loggedInUser);
	} else {
		res.status(401).send('Not Authorized');
	}
});

module.exports = router;
