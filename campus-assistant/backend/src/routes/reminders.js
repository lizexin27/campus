const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { auth } = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 提醒路由
router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.put('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;