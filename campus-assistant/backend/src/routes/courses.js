const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 所有路由都需要认证
router.use(auth);

// 课程路由
router.get('/', courseController.getCourses);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// OCR 导入路由
router.post('/ocr', upload.single('image'), courseController.importCourseFromOCR);

module.exports = router;