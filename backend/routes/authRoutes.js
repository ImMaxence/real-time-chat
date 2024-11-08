const express = require('express');
const { register, logIn, logOut, verifyToken } = require('../controllers/authController');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');

router.post('/register', register);
router.post('/log-in', logIn);
router.post('/log-out', logOut);
router.get('/verify-token', checkAuth(1), verifyToken);

module.exports = router;