import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import api, { todoAPI, courseAPI } from '@/utils/api';
import { Todo, Course } from '@/types';

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState('today');

  // 获取今日课程
  const todayCourses = courses.filter(course => {
    const today = new Date();
    return course.weekDay === today.getDay();
  });

  // 获取紧急待办
  const urgentTodos = todos.filter(todo =>
    !todo.completed &&
    todo.priority === 'high' &&
    todo.time &&
    new Date(todo.time) > new Date()
  ).slice(0, 3);

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(date, 'M月d日 EEEE', { locale: zhCN });
  };

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好，同学';
    if (hour < 18) return '下午好，同学';
    return '晚上好，同学';
  };

  // 模拟加载
  useEffect(() => {
    // 这里应该从API获取数据，暂时使用模拟数据
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: '完成数学作业',
        priority: 'high',
        time: '2024-03-17 14:00',
        completed: false,
        repeat: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: '准备英语演讲',
        priority: 'medium',
        time: '2024-03-17 16:00',
        completed: false,
        repeat: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockCourses: Course[] = [
      {
        id: '1',
        name: '高等数学',
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
        room: 'B205',
        startTime: '10:00',
        endTime: '11:40',
        weekDay: 2,
        weekRange: '1-16',
        color: '#4ECDC4',
        createdAte: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTodos(mockTodos);
    setCourses(mockCourses);
  }, []);

  return (
    <div className="scroll-container bg-gray-50 pb-20">
      {/* 顶部日期和问候 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-medium">{formatDate(date)}</h1>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ios-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
          </button>
        </div>
        <p className="text-xl opacity-90">{getGreeting()}</p>
      </div>

      <div className="px-4">
        {/* 今日课程 */}
        {todayCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-blue-500">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              今日课程
            </h2>
            <div className="space-y-3">
              {todayCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="ios-card bg-white rounded-xl p-4 border-l-4"
                  style={{ borderLeftColor: course.color }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        {course.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{course.startTime}</p>
                      <p className="text-gray-500 text-xs mt-1">-</p>
                      <p className="font-mono text-sm">{course.endTime}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 紧急待办 */}
        {urgentTodos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-red-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              紧急待办
            </h2>
            <div className="space-y-3">
              {urgentTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="ios-card bg-red-50 rounded-xl p-4 border border-red-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium flex-1">{todo.title}</h3>
                    <span className="text-red-500 text-sm font-medium">
                      {format(new Date(todo.time), 'HH:mm')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 底部操作按钮 */}
        <div className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-full font-medium shadow-lg"
              onClick={() => {
                // 跳转到待办页面
                window.location.href = '/todos';
              }}
            >
              添加待办
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-100 py-3 px-6 rounded-full font-medium"
              onClick={() => {
                // 跳转到课程表页面
                window.location.href = '/schedule';
              }}
            >
              课程表
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;