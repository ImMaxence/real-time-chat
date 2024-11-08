const express = require('express');
const { getAllUser } = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.get('/get-all', checkAuth(1), getAllUser);

module.exports = router;