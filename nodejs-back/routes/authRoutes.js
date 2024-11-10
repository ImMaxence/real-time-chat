const express = require('express');
const { register, logIn, logOut, verifyToken } = require('../controllers/authController');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const { upload, resizeImage } = require('../middlewares/imageProcess');

router.post('/register', upload.single('image'), resizeImage, register);
router.post('/log-in', logIn);
router.post('/log-out', logOut);
router.get('/verify-token', checkAuth(1), verifyToken);

module.exports = router;