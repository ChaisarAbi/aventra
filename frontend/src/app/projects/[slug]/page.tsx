'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApi } from '@/lib/api';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await publicApi.getProjectBySlug(slug);
        setProject(response.data || null);
      } catch (error: any) {
        console.error('Error fetching project:', error);
        if (error.response?.status === 404) {
          setError('Project not found');
        } else {
          setError('Failed to load project');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested project could not be found.'}</p>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const technologies = project.technologies.split(',').map(tech => tech.trim());
  const createdDate = new Date(project.created_at).toLocaleDateString();
  const updatedDate = new Date(project.updated_at).toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/projects')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Image */}
          {project.image_url && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}
          
          {/* Project Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {createdDate}</span>
              </div>
              {createdDate !== updatedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {updatedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.featured && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-xs">
                    Featured
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Project Content */}
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {project.content ? (
                  <ReactMarkdown>{project.content}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">No detailed description available for this project.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technologies */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Links */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Project Links</h3>
              <div className="space-y-3">
                {project.github_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Source Code
                    </a>
                  </Button>
                )}
                
                {project.demo_url && (
                  <Button asChild className="w-full justify-start">
                    <a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                
                {!project.github_url && !project.demo_url && (
                  <p className="text-sm text-muted-foreground text-center">
                    No external links available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Interested in this project?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions or want to collaborate on something similar?
              </p>
              <Button asChild className="w-full">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
