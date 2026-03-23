import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isToday, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import api, { todoAPI } from '@/utils/api';
import { Todo } from '@/types';

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    time: '',
    repeat: 'none' as 'daily' | 'weekly' | 'monthly' | 'none',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // 优先级颜色映射
  const priorityColors = {
    high: '#FF6B6B',
    medium: '#FFA500',
    low: '#4ECDC4',
  };

  // 过滤待办
  const filteredTodos = todos.filter(todo => {
    const matchesTab = activeTab === 'pending' ? !todo.completed : todo.completed;
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 分组待办
  const pendingTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  // 创建待办
  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) return;

    try {
      const response = await todoAPI.createTodo({
        ...newTodo,
        completed: false,
      });

      setTodos([response, ...todos]);
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        time: '',
        repeat: 'none',
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  // 切换待办状态
  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await todoAPI.toggleTodo(id, completed);
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  // 删除待办
  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  // 模拟加载数据
  useEffect(() => {
    // 这里应该从API获取数据，暂时使用模拟数据
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: '完成数学作业',
        description: '第三章习题1-20题',
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
        description: '主题：环境保护',
        priority: 'medium',
        time: '2024-03-17 16:00',
        completed: false,
        repeat: 'weekly',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: '购买笔记本',
        priority: 'low',
        completed: true,
        repeat: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTodos(mockTodos);
  }, []);

  return (
    <div className="scroll-container bg-gray-50">
      {/* 顶部标题 */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">待办事项</h1>
        </div>

        {/* 搜索框 */}
        <div className="px-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索待办..."
              className="w-full ios-input pl-10 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex border-t border-gray-100">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'pending' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            进行中
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'completed' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </button>
        </div>
      </div>

      {/* 待办列表 */}
      <div className="px-4 py-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {activeTab === 'pending' ? '暂无待办事项' : '暂无已完成事项'}
          </div>
        ) : (
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="ios-card mb-3"
              >
                <div className="flex items-start">
                  <button
                    className="w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ios-button"
                    style={{
                      borderColor: priorityColors[todo.priority],
                      backgroundColor: todo.completed ? '#4A90E2' : 'transparent',
                    }}
                    onClick={() => handleToggleTodo(todo.id, !todo.completed)}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                      </h3>
                      <button
                        className="text-gray-400 ios-button p-1"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {todo.description && (
                      <p className="text-gray-500 text-sm mt-1 ml-9">{todo.description}</p>
                    )}

                    <div className="flex items-center mt-2 ml-9">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: priorityColors[todo.priority] }}
                      ></div>
                      {todo.time && (
                        <span className="text-xs text-gray-500">
                          {parseISO(todo.time).toLocaleDateString('zh-CN')} {parseISO(todo.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {todo.repeat && todo.repeat !== 'none' && (
                        <span className="text-xs text-gray-400 ml-2">
                          重复
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 添加按钮 */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center ios-button"
        onClick={() => setShowAddModal(true)}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 添加待办模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-3xl w-full max-w-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">添加待办</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="待办标题"
                className="w-full ios-input px-4 py-3"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />

              <textarea
                placeholder="描述（可选）"
                className="w-full ios-input px-4 py-3 resize-none"
                rows={3}
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  className="ios-input px-4 py-3"
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                >
                  <option value="high">高优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="low">低优先级</option>
                </select>

                <input
                  type="time"
                  className="ios-input px-4 py-3"
                  value={newTodo.time}
                  onChange={(e) => setNewTodo({ ...newTodo, time: e.target.value })}
                />
              </div>

              <select
                className="ios-input px-4 py-3"
                value={newTodo.repeat}
                onChange={(e) => setNewTodo({ ...newTodo, repeat: e.target.value as any })}
              >
                <option value="none">不重复</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-3 text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button
                className="flex-1 py-3 bg-blue-500 text-white rounded-full font-medium"
                onClick={handleCreateTodo}
              >
                添加
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;