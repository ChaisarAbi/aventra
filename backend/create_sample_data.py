#!/usr/bin/env python3
"""
Script to create sample projects for the portfolio website.
Run this script after the backend is running to populate the database with sample data.
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8001"
ADMIN_USERNAME = "abi"
ADMIN_PASSWORD = "Leaveempty1!"

# Sample projects data
SAMPLE_PROJECTS = [
    {
        "title": "Machine Learning API",
        "slug": "machine-learning-api",
        "description": "A FastAPI-based machine learning service that provides intelligent predictions and data analysis capabilities.",
        "content": """# Machine Learning API

This project is a comprehensive machine learning API built with FastAPI and Python. It provides various ML capabilities including:

## Features
- **Predictive Analytics**: Real-time predictions using trained models
- **Data Processing**: Automated data cleaning and preprocessing
- **Model Management**: Version control and model deployment
- **RESTful API**: Clean, documented endpoints for easy integration

## Technologies Used
- FastAPI for the web framework
- Scikit-learn for machine learning models
- SQLModel for database operations
- Docker for containerization
- JWT for authentication

## Architecture
The system follows a microservices architecture with separate services for:
- Model training and management
- API serving
- Data processing pipeline

## Performance
- Average response time: < 200ms
- Supports up to 1000 concurrent requests
- 99.9% uptime guarantee

This project demonstrates my expertise in building scalable machine learning systems and RESTful APIs.""",
        "technologies": "FastAPI, Python, Scikit-learn, SQLModel, Docker, JWT",
        "github_url": "https://github.com/abi/ml-api",
        "demo_url": "https://ml-api.aventra.my.id",
        "featured": True,
        "status": "completed",
        "image_url": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        "title": "React Dashboard",
        "slug": "react-dashboard",
        "description": "A modern React dashboard with real-time analytics, charts, and interactive data visualization components.",
        "content": """# React Dashboard

A comprehensive dashboard application built with React and modern web technologies for data visualization and analytics.

## Key Features
- **Real-time Analytics**: Live data updates and monitoring
- **Interactive Charts**: Multiple chart types (line, bar, pie, scatter)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: User preference-based theme switching
- **Data Export**: Export reports in multiple formats

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js with custom components
- **State Management**: React Context + useReducer
- **API Integration**: Axios for HTTP requests
- **Build Tools**: Vite for fast development

## Architecture
- Component-based architecture with reusable UI components
- Custom hooks for data fetching and state management
- Error boundaries for graceful error handling
- Performance optimization with React.memo and useMemo

## User Experience
- Loading states and skeleton screens
- Error handling with user-friendly messages
- Keyboard navigation support
- Progressive Web App capabilities

This project showcases my frontend development skills and attention to user experience.""",
        "technologies": "React, TypeScript, Tailwind CSS, Chart.js, Vite",
        "github_url": "https://github.com/abi/react-dashboard",
        "demo_url": "https://dashboard.aventra.my.id",
        "featured": True,
        "status": "completed",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        "title": "Portfolio Website",
        "slug": "portfolio-website",
        "description": "This very portfolio website built with Next.js 15, featuring a modern design with dark/light mode and admin panel.",
        "content": """# Portfolio Website

This portfolio website showcases my projects and skills as a full-stack developer. Built with modern web technologies and best practices.

## Features
- **Modern Design**: Clean, professional appearance with smooth animations
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Admin Panel**: Secure content management system for project updates
- **Responsive**: Optimized for all device sizes
- **SEO Optimized**: Proper meta tags and structured data
- **Contact Form**: Integrated contact system with validation

## Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: FastAPI with Python and SQLModel
- **Database**: SQLite for development, PostgreSQL ready
- **Authentication**: JWT-based admin authentication
- **Deployment**: Docker containerization

## Architecture
- **Frontend**: Next.js App Router with server-side rendering
- **Backend**: RESTful API with FastAPI
- **Database**: SQLModel ORM with SQLite
- **Admin**: Protected routes with JWT authentication
- **Contact**: Form handling with validation and email integration

## Performance
- Lighthouse scores: 95+ for performance, accessibility, best practices
- Fast loading times with optimized images and code splitting
- SEO-friendly with proper meta tags and OpenGraph

This project demonstrates my full-stack development capabilities and attention to modern web standards.""",
        "technologies": "Next.js, React, TypeScript, Tailwind CSS, FastAPI, SQLModel",
        "github_url": "https://github.com/abi/portfolio",
        "demo_url": "https://aventra.my.id",
        "featured": True,
        "status": "completed",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        "title": "E-commerce Platform",
        "slug": "ecommerce-platform",
        "description": "A full-stack e-commerce solution with product management, shopping cart, and payment integration.",
        "content": """# E-commerce Platform

A complete e-commerce solution built from the ground up with modern web technologies and best practices.

## Core Features
- **Product Catalog**: Advanced product search and filtering
- **Shopping Cart**: Persistent cart with guest and user modes
- **User Authentication**: Secure login and registration
- **Payment Processing**: Stripe integration for secure payments
- **Order Management**: Complete order lifecycle management
- **Admin Dashboard**: Comprehensive admin interface

## Technical Implementation
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python and PostgreSQL
- **Authentication**: JWT tokens with refresh mechanism
- **Payments**: Stripe API integration
- **Search**: Elasticsearch for product search
- **Caching**: Redis for performance optimization

## Security Features
- Input validation and sanitization
- CSRF protection
- Rate limiting
- Secure payment processing
- Data encryption at rest and in transit

## Scalability
- Microservices architecture
- Load balancing ready
- Database replication
- CDN integration for static assets

This project demonstrates my ability to build complex, secure, and scalable web applications.""",
        "technologies": "Next.js, FastAPI, PostgreSQL, Stripe, Redis, Docker",
        "github_url": "https://github.com/abi/ecommerce",
        "demo_url": "https://shop.aventra.my.id",
        "featured": False,
        "status": "in-progress",
        "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        "title": "Task Management App",
        "slug": "task-management-app",
        "description": "A collaborative task management application with real-time updates and team collaboration features.",
        "content": """# Task Management Application

A modern task management application designed for teams and individuals to organize and track their work efficiently.

## Key Features
- **Real-time Collaboration**: Live updates when team members make changes
- **Task Boards**: Kanban-style boards with drag-and-drop functionality
- **Team Management**: User roles and permissions
- **File Attachments**: Support for file uploads and previews
- **Notifications**: Email and in-app notifications
- **Time Tracking**: Built-in time tracking for tasks

## Technology Stack
- **Frontend**: React with TypeScript and Material-UI
- **Backend**: Node.js with Express and Socket.io
- **Database**: MongoDB for flexible data structure
- **Real-time**: WebSocket connections for live updates
- **Storage**: AWS S3 for file storage
- **Deployment**: Docker and Kubernetes

## User Experience
- Intuitive drag-and-drop interface
- Keyboard shortcuts for power users
- Mobile-responsive design
- Offline capability with sync when online

## Security & Performance
- End-to-end encryption for sensitive data
- Rate limiting and DDoS protection
- Optimized database queries
- Caching strategy for improved performance

This project showcases my skills in building real-time applications and collaborative tools.""",
        "technologies": "React, Node.js, MongoDB, Socket.io, AWS, Docker",
        "github_url": "https://github.com/abi/task-manager",
        "demo_url": "https://tasks.aventra.my.id",
        "featured": False,
        "status": "planned",
        "image_url": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
]

def create_sample_data():
    """Create sample projects by making API calls to the backend."""
    
    # First, login to get JWT token
    print("Logging in to admin account...")
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/admin/login",
            data={
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
        )
        
        if login_response.status_code != 200:
            print(f"Login failed: {login_response.text}")
            return False
            
        token_data = login_response.json()
        access_token = token_data["access_token"]
        print("Login successful!")
        
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to backend at {BASE_URL}")
        print("Make sure the backend server is running on port 8001")
        return False
    
    # Headers for authenticated requests
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Create each sample project
    created_count = 0
    for project_data in SAMPLE_PROJECTS:
        try:
            print(f"Creating project: {project_data['title']}")
            
            response = requests.post(
                f"{BASE_URL}/api/admin/projects",
                headers=headers,
                json=project_data
            )
            
            if response.status_code == 200:
                print(f"✓ Successfully created: {project_data['title']}")
                created_count += 1
            else:
                print(f"✗ Failed to create {project_data['title']}: {response.text}")
                
        except Exception as e:
            print(f"✗ Error creating {project_data['title']}: {str(e)}")
    
    print(f"\nCreated {created_count} out of {len(SAMPLE_PROJECTS)} sample projects")
    return True

if __name__ == "__main__":
    print("nsetyo Portfolio - Sample Data Creator")
    print("=" * 50)
    
    success = create_sample_data()
    
    if success:
        print("\n✅ Sample data creation completed!")
        print(f"Frontend: http://localhost:3501")
        print(f"Backend API: http://localhost:8001")
        print(f"API Documentation: http://localhost:8001/docs")
        print(f"Admin Login: http://localhost:3501/admin/login")
    else:
        print("\n❌ Sample data creation failed!")
        sys.exit(1)
