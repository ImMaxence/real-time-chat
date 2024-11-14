const express = require('express');
const { createMessage, editMessage, deleteMessage, getAllMessages } = require('../controllers/messageController');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();
const { upload, resizeImage } = require('../middlewares/imageProcess');

router.get('/get-all', checkAuth(1), getAllMessages);
router.post('/create', checkAuth(1), upload.single('image'), resizeImage, createMessage);
router.put('/update', checkAuth(1), editMessage);
router.delete('/delete', checkAuth(1), deleteMessage);

module.exports = router;
