import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameWeek, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import api, { courseAPI } from '@/utils/api';
import { Course } from '@/types';

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 时间段配置
  const timeSlots = [
    { start: '08:00', end: '09:40' },
    { start: '10:00', end: '11:40' },
    { start: '13:30', end: '15:10' },
    { start: '15:30', end: '17:10' },
    { start: '19:00', end: '20:40' },
  ];

  // 星期名称
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const weekDayNumbers = [1, 2, 3, 4, 5, 6, 7];

  // 获取当前周的课程
  const getWeekCourses = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // 周一开始
    return courses.filter(course => {
      const courseDate = new Date();
      courseDate.setDate(weekStart.getDate() + (course.weekDay - 1));
      return isSameWeek(courseDate, date, { weekStartsOn: 1 });
    });
  };

  // 处理周数切换
  const handleWeekChange = (direction: 'next' | 'prev') => {
    setSelectedWeek(prev => prev + (direction === 'next' ? 1 : -1));
    setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  // 选择日期
  const handleDateSelect = (day: number) => {
    const selected = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), day - 1);
    setCurrentDate(selected);
    setShowDatePicker(false);
  };

  // 导入课表
  const handleImportSchedule = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    courseAPI.importCourseFromOCR(file)
      .then(response => {
        // 这里应该处理返回的课程数据
        console.log('导入成功:', response);
        alert('课程表导入成功！');
        setShowImportModal(false);
      })
      .catch(error => {
        console.error('导入失败:', error);
        alert('课程表导入失败，请重试');
      });
  };

  // 获取当前周的日期
  const getWeekDates = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  // 模拟课程数据
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        name: '高等数学',
        teacher: '张教授',
        room: 'A301',
        startTime: '08:00',
        endTime: '09:40',
        weekDay: 2, // 周二
        weekRange: '1-16',
        color: '#FF6B6B',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: '大学英语',
        teacher: '李老师',
        room: 'B205',
        startTime: '10:00',
        endTime: '11:40',
        weekDay: 2,
        weekRange: '1-16',
        color: '#4ECDC4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: '计算机基础',
        teacher: '王老师',
        room: 'C401',
        startTime: '13:30',
        endTime: '15:10',
        weekDay: 3, // 周三
        weekRange: '1-16',
        color: '#45B7D1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: '物理实验',
        teacher: '赵老师',
        room: '实验室3',
        startTime: '15:30',
        endTime: '17:10',
        weekDay: 4, // 周四
        weekRange: '3-16',
        color: '#96CEB4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setCourses(mockCourses);
  }, []);

  const weekDates = getWeekDates();
  const weekCourses = getWeekCourses(currentDate);

  return (
    <div className="scroll-container bg-gray-50">
      {/* 顶部标题 */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">课程表</h1>
        </div>

        {/* 周数切换和日期显示 */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ios-button"
              onClick={() => handleWeekChange('prev')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center">
              <button
                className="text-blue-500 font-medium mr-1"
                onClick={() => setShowDatePicker(true)}
              >
                第 {Math.abs(selectedWeek) + 1} 周
              </button>
              {selectedWeek !== 0 && (
                <button
                  className="text-xs text-gray-500"
                  onClick={() => {
                    setSelectedWeek(0);
                    setCurrentDate(new Date());
                  }}
                >
                  返回本周
                </button>
              )}
            </div>

            <button
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ios-button"
              onClick={() => handleWeekChange('next')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 星期选择器 */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => {
              const date = weekDates[index];
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === currentDate.toDateString();

              return (
                <button
                  key={day}
                  className={`py-2 rounded-lg text-sm font-medium ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : isToday
                      ? 'bg-blue-50 text-blue-500'
                      : 'text-gray-600'
                  }`}
                  onClick={() => handleDateSelect(index + 1)}
                >
                  <div>{day}</div>
                  <div className="text-xs">{format(date, 'd')}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 课程表主体 */}
      <div className="px-4 py-4">
        {weekCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            本周暂无课程安排
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden">
            {/* 时间表头 */}
            <div className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2"></div>
              {timeSlots.map((slot, index) => (
                <div key={index} className="text-xs text-center text-gray-500 p-2">
                  {slot.start}
                </div>
              ))}
            </div>

            {/* 课程表内容 */}
            {weekDays.map((_, dayIndex) => {
              const dayCourses = weekCourses.filter(course => course.weekDay === dayIndex + 1);

              return (
                <div key={dayIndex} className="grid grid-cols-8 border-b border-gray-100">
                  {/* 星期列 */}
                  <div className="p-2 text-center text-sm font-medium text-gray-600">
                    {weekDays[dayIndex]}
                  </div>

                  {/* 时间段列 */}
                  {timeSlots.map((slot, slotIndex) => {
                    const course = dayCourses.find(c => {
                      return c.startTime === slot.start && c.endTime === slot.end;
                    });

                    return (
                      <div key={slotIndex} className="relative p-1 min-h-[80px]">
                        {course && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-2 rounded-lg p-3 text-white shadow-md"
                            style={{ backgroundColor: course.color }}
                            onClick={() => setSelectedCourse(course)}
                          >
                            <div className="font-medium text-sm">{course.name}</div>
                            <div className="text-xs opacity-90 mt-1">{course.room}</div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 导入按钮 */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center ios-button"
        onClick={() => setShowImportModal(true)}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </button>

      {/* 课程详情模态框 */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-3xl w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedCourse.name}</h2>
              <button
                className="text-gray-400 ios-button p-1"
                onClick={() => setSelectedCourse(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">地点：{selectedCourse.room}</span>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">
                  时间：{selectedCourse.startTime} - {selectedCourse.endTime}
                </span>
              </div>

              {selectedCourse.teacher && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">教师：{selectedCourse.teacher}</span>
                </div>
              )}

              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">周次：第 {selectedCourse.weekRange} 周</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 py-3 bg-red-50 text-red-500 rounded-full font-medium"
                onClick={() => {
                  // 删除课程逻辑
                  setSelectedCourse(null);
                }}
              >
                删除课程
              </button>
              <button
                className="flex-1 py-3 bg-blue-500 text-white rounded-full font-medium"
                onClick={() => {
                  // 编辑课程逻辑
                  setSelectedCourse(null);
                }}
              >
                编辑课程
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 日期选择器 */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">选择日期</h2>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => (
                <button
                  key={index}
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: date.toDateString() === currentDate.toDateString() ? '#4A90E2' : '#f5f5f7',
                    color: date.toDateString() === currentDate.toDateString() ? 'white' : 'inherit',
                  }}
                  onClick={() => handleDateSelect(index + 1)}
                >
                  <div>{weekDays[index]}</div>
                  <div className="text-lg font-medium">{format(date, 'd')}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 导入模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">导入课程表</h2>
            <p className="text-gray-600 mb-4">拍摄或选择课表图片，系统将自动识别并导入</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-500 mb-3">点击选择图片或拍照</p>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImportSchedule}
                className="hidden"
              />
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                选择图片
              </button>
            </div>

            <button
              className="w-full mt-4 py-3 text-gray-600"
              onClick={() => setShowImportModal(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;