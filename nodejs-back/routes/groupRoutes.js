// routes/groupRoutes.js
const express = require('express');
const { createGroup, getGroupMessages, addMemberToGroup, removeMemberFromGroup, getAllGroups, updateGroup, deleteGroup, getGroupUsers, getUserGroups } = require('../controllers/groupController');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.post('/create', checkAuth(1), createGroup);
router.get('/:groupId/messages', checkAuth(1), getGroupMessages);
router.post('/:groupId/add-member', checkAuth(1), addMemberToGroup);
router.post('/:groupId/remove-member', checkAuth(1), removeMemberFromGroup);
router.get('/get-all', checkAuth(1), getAllGroups);
router.put('/:groupId/update', checkAuth(1), updateGroup);
router.delete('/:groupId/delete', checkAuth(1), deleteGroup);
router.get('/:groupId/users', checkAuth(1), getGroupUsers)
router.get('/:userId/groups', checkAuth(1), getUserGroups)

module.exports = router;
