'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const technologies = project.technologies.split(',').map(tech => tech.trim());

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Project Image */}
      {project.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>
      )}
      
      <CardHeader className={project.image_url ? 'pt-4' : ''}>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className={`px-2 py-1 rounded-full text-xs ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : project.status === 'in-progress'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            {project.status}
          </span>
          {project.featured && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-xs">
              Featured
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/projects/${project.slug}`}>
            View Details
          </Link>
        </Button>
        
        <div className="flex space-x-2">
          {project.github_url && (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {project.demo_url && (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Live Demo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
