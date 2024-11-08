const express = require('express');
const { getAllUser, getUserById, deleteUser, updateUser } = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.get('/get-all', checkAuth(1), getAllUser);
router.get('/:id/get-by-id', checkAuth(1), getUserById);
router.delete('/:id/delete', checkAuth(1), deleteUser);
router.put('/:id/update', checkAuth(1), updateUser);

module.exports = router;