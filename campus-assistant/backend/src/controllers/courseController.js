const Course = require('../models/Course');
const Todo = require('../models/Todo');
const OCRService = require('../services/ocrService');

// 获取所有课程
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id })
      .sort({ weekDay: 1, startTime: 1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 创建课程
exports.createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      userId: req.user.id
    });

    await course.save();

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// OCR 导入课表
exports.importCourseFromOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { file } = req;
    const userId = req.user.id;

    // OCR 识别
    const ocrResult = await OCRService.extractTextFromImage(file.path);

    // 解析 OCR 结果，提取课程信息
    const courses = await OCRService.parseCourseSchedule(ocrResult.text);

    // 保存到数据库
    const savedCourses = [];
    for (const courseData of courses) {
      const course = new Course({
        ...courseData,
        userId: userId
      });
      await course.save();
      savedCourses.push(course);
    }

    // 清理临时文件
    require('fs').unlinkSync(file.path);

    res.json({
      success: true,
      message: `Successfully imported ${savedCourses.length} courses`,
      data: savedCourses
    });
  } catch (error) {
    // 清理临时文件
    if (req.file) {
      require('fs').unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 更新课程
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 删除课程
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};