export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  time?: string;
  completed: boolean;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  teacher?: string;
  room: string;
  startTime: string;
  endTime: string;
  weekDay: number; // 1-7 (周一到周日)
  weekRange: string; // "1-4,6-8" 等格式
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  content?: string;
  time: string;
  type: 'todo' | 'course';
  relatedId?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  token?: string;
}