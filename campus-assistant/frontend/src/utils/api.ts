import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// 待办相关 API
export const todoAPI = {
  // 获取待办列表
  getTodos: () => api.get('/todos'),

  // 创建待办
  createTodo: (data: any) => api.post('/todos', data),

  // 更新待办
  updateTodo: (id: string, data: any) => api.put(`/todos/${id}`, data),

  // 删除待办
  deleteTodo: (id: string) => api.delete(`/todos/${id}`),

  // 更新待办状态
  toggleTodo: (id: string, completed: boolean) => api.patch(`/todos/${id}`, { completed }),
};

// 课程相关 API
export const courseAPI = {
  // 获取课程表
  getCourses: () => api.get('/courses'),

  // 创建课程
  createCourse: (data: any) => api.post('/courses', data),

  // OCR 导入课表
  importCourseFromOCR: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/courses/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 更新课程
  updateCourse: (id: string, data: any) => api.put(`/courses/${id}`, data),

  // 删除课程
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),
};

// 提醒相关 API
export const reminderAPI = {
  // 设置提醒
  setReminder: (data: any) => api.post('/reminders', data),

  // 获取提醒列表
  getReminders: () => api.get('/reminders'),

  // 更新提醒
  updateReminder: (id: string, data: any) => api.put(`/reminders/${id}`, data),

  // 删除提醒
  deleteReminder: (id: string) => api.delete(`/reminders/${id}`),
};