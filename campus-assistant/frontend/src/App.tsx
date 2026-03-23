import React from 'react';
import { motion } from 'motion/react';
import { RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import TodoPage from './views/TodoPage';
import SchedulePage from './views/SchedulePage';
import ProfilePage from './views/ProfilePage';

// 底部导航栏
const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'home',
      label: '首页',
      icon: '🏠',
      path: '/',
    },
    {
      id: 'todos',
      label: '待办',
      icon: '✅',
      path: '/todos',
    },
    {
      id: 'schedule',
      label: '课程表',
      icon: '📅',
      path: '/schedule',
    },
    {
      id: 'profile',
      label: '我的',
      icon: '👤',
      path: '/profile',
    },
  ];

  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || 'home';

  return (
    <div className="ios-tab-bar">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`ios-tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl mb-1">{tab.icon}</span>
          <span className="text-xs">{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// 主路由组件
const AppRouter = () => {
  const location = useLocation();

  const routes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/todos',
      element: <TodoPage />,
    },
    {
      path: '/schedule',
      element: <SchedulePage />,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
  ];

  const currentRoute = routes.find(route => route.path === location.pathname);

  return (
    <div className="relative" style={{ paddingBottom: '70px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentRoute?.element}
        </motion.div>
      </AnimatePresence>
      <TabBar />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AppRouter />
    </RouterProvider>
  );
}