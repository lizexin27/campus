const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

class OCRService {
  // 从图片中提取文本
  static async extractTextFromImage(imagePath) {
    try {
      const result = await Tesseract.recognize(
        imagePath,
        'chi_sim+eng',
        {
          logger: m => console.log(m),
        }
      );

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words
      };
    } catch (error) {
      throw new Error(`OCR recognition failed: ${error.message}`);
    }
  }

  // 解析课程表文本
  static async parseCourseSchedule(text) {
    // 这里实现课程表解析逻辑
    // 由于实际OCR识别结果复杂，这里提供一个简单的解析示例

    const courses = [];
    const timeRegex = /(\d{1,2}:\d{2})\s*[-~到]\s*(\d{1,2}:\d{2})/g;
    const dayRegex = /周一|周二|周三|周四|周五|周六|周日|星期[一二三四五六日]/g;

    // 解析星期
    const dayMatch = text.match(dayRegex);
    const weekDayMap = {
      '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '周日': 7,
      '星期一': 1, '星期二': 2, '星期三': 3, '星期四': 4, '星期五': 5, '星期六': 6, '星期日': 7
    };

    let weekDay = dayMatch ? weekDayMap[dayMatch[0]] : 1; // 默认周一

    // 解析时间段
    const timeMatches = [...text.matchAll(timeRegex)];
    let startTime = '08:00';
    let endTime = '09:40';

    if (timeMatches.length > 0) {
      startTime = timeMatches[0][1];
      endTime = timeMatches[0][2];
    }

    // 解析课程名
    const courseNameRegex = /([^\d\s]+)\s*(课程|课)/g;
    const nameMatch = courseNameRegex.exec(text);
    const courseName = nameMatch ? nameMatch[1] : '课程';

    // 解析教室
    const roomRegex = /([ABC]\d{3}|\d{3}教室|教学楼\d+)/g;
    const roomMatch = text.match(roomRegex);
    const room = roomMatch ? roomMatch[0] : '教室待定';

    // 生成随机颜色
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#48C9B0', '#9B59B6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    courses.push({
      name: courseName,
      room: room,
      startTime: startTime,
      endTime: endTime,
      weekDay: weekDay,
      weekRange: '1-16',
      color: color
    });

    return courses;
  }
}

module.exports = OCRService;