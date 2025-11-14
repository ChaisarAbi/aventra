import axios from 'axios';
import { Project, ProjectCreate, ProjectUpdate, ContactMessage, AdminLogin, AuthToken } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.aventra.my.id';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Public API endpoints
export const publicApi = {
  // Projects
  getProjects: (featured?: boolean) => 
    api.get<Project[]>('/api/projects', { params: { featured } }),
  
  getProjectBySlug: (slug: string) => 
    api.get<Project>(`/api/projects/${slug}`),
  
  getProjectById: (id: number) => 
    api.get<Project>(`/api/projects/id/${id}`),
  
  // Contact
  sendContactMessage: (data: ContactMessage) => 
    api.post('/api/contact', data),
};

// Admin API endpoints
export const adminApi = {
  // Auth
  login: (data: AdminLogin) => {
    return api.post<AuthToken>('/api/admin/login', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Projects
  getProjects: () => 
    api.get<Project[]>('/api/admin/projects'),
  
  createProject: (data: ProjectCreate) => 
    api.post<Project>('/api/admin/projects', data),
  
  updateProject: (id: number, data: ProjectUpdate) => 
    api.put<Project>(`/api/admin/projects/${id}`, data),
  
  deleteProject: (id: number) => 
    api.delete(`/api/admin/projects/${id}`),
  
  // Messages
  getMessages: () => 
    api.get('/api/admin/messages'),
  
  markMessageAsRead: (messageId: number) => 
    api.post(`/api/admin/messages/${messageId}/read`),
  
  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  },
  
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin_token');
    }
    return false;
  },
};

export default api;
