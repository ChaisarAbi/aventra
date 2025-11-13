export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string;
  github_url?: string;
  demo_url?: string;
  featured: boolean;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string;
  github_url?: string;
  demo_url?: string;
  featured: boolean;
  image_url?: string;
  status: string;
}

export interface ProjectUpdate {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  technologies?: string;
  github_url?: string;
  demo_url?: string;
  featured?: boolean;
  image_url?: string;
  status?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
