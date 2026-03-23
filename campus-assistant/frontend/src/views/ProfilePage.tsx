import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import api, { todoAPI, courseAPI } from '@/utils/api';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '学生用户',
    avatar: '',
    streak: 7, // 连续签到天数
    totalTodos: 25,
    completedTodos: 18,
  });

  const [stats, setStats] = useState({
    todayTodos: 3,
    weekTodos: 12,
    monthTodos: 45,
  });

  // 菜单项
  const menuItems = [
    { id: 'profile', icon: '👤', title: '个人信息', subtitle: '查看和编辑个人资料' },
    { id: 'settings', icon: '⚙️', title: '设置', subtitle: '通知、主题等设置' },
    { id: 'reminders', icon: '⏰', title: '提醒管理', subtitle: '管理课程和待办提醒' },
    { id: 'stats', icon: '📊', title: '学习统计', subtitle: '查看学习数据' },
    { id: 'backup', icon: '💾', title: '数据备份', subtitle: '导出和备份数据' },
    { id: 'help', icon: '❓', title: '帮助与反馈', subtitle: '常见问题和使用帮助' },
  ];

  const handleMenuClick = (id: string) => {
    switch (id) {
      case 'profile':
        // 跳转到个人信息页面
        break;
      case 'settings':
        // 跳转到设置页面
        break;
      case 'reminders':
        // 跳转到提醒管理页面
        break;
      case 'stats':
        // 跳转到统计页面
        break;
      case 'backup':
        handleBackup();
        break;
      case 'help':
        // 跳转到帮助页面
        break;
    }
  };

  const handleBackup = () => {
    // 这里可以实现数据备份功能
    alert('数据备份功能开发中...');
  };

  return (
    <div className="scroll-container bg-gray-50">
      {/* 顶部用户信息 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mr-4">
            {user.avatar ? (
              <img src={user.avatar} alt="用户头像" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl">👨‍🎓</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="opacity-90 mt-1">已连续签到 {user.streak} 天</p>
          </div>
        </div>

        {/* 学习统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur rounded-2xl p-4"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{user.totalTodos}</p>
              <p className="text-sm opacity-90 mt-1">待办总数</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{user.completedTodos}</p>
              <p className="text-sm opacity-90 mt-1">已完成</p>
            </div>
            <div>
              <p className="text-3xl font-bold">72%</p>
              <p className="text-sm opacity-90 mt-1">完成率</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-4">
        {/* 今日概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 mb-4"
        >
          <h2 className="text-lg font-semibold mb-3">今日概览</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">待办任务</span>
              <span className="font-medium">{stats.todayTodos} 项</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">本周任务</span>
              <span className="font-medium">{stats.weekTodos} 项</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">本月任务</span>
              <span className="font-medium">{stats.monthTodos} 项</span>
            </div>
          </div>
        </motion.div>

        {/* 功能菜单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 last:border-b-0"
            >
              <button
                className="w-full flex items-center justify-between p-4 ios-button"
                onClick={() => handleMenuClick(item.id)}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div className="text-left">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* 版本信息 */}
        <div className="text-center mt-8 mb-4">
          <p className="text-gray-400 text-sm">校园智能助手 v1.0.0</p>
          <p className="text-gray-400 text-xs mt-1">让学习更高效</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;