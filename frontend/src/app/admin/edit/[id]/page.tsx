'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { adminApi, authUtils } from '@/lib/api';
import { Project, ProjectUpdate } from '@/types';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminRoute } from '@/components/AdminRoute';
import ImageUpload from '@/components/ImageUpload';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().optional(),
  technologies: z.string().min(1, 'Technologies are required'),
  github_url: z.string().optional().or(z.literal('')).default(''),
  demo_url: z.string().optional().or(z.literal('')).default(''),
  image_url: z.string().optional().or(z.literal('')).default(''),
  featured: z.boolean().default(false),
  status: z.enum(['planned', 'in-progress', 'completed']).default('planned'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      technologies: '',
      github_url: '',
      demo_url: '',
      image_url: '',
      featured: false,
      status: 'planned',
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await adminApi.getProjects();
        const projects = response.data;
        const currentProject = projects.find(p => p.id === projectId);
        
        if (currentProject) {
          setProject(currentProject);
          form.reset({
            title: currentProject.title,
            slug: currentProject.slug,
            description: currentProject.description,
            content: currentProject.content || '',
            technologies: currentProject.technologies,
            github_url: currentProject.github_url || '',
            demo_url: currentProject.demo_url || '',
            image_url: currentProject.image_url || '',
            featured: currentProject.featured,
            status: currentProject.status as "planned" | "in-progress" | "completed",
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authUtils.isAuthenticated()) {
      fetchProject();
    } else {
      router.push('/admin/login');
    }
  }, [projectId, form, router]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const projectData: ProjectUpdate = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        technologies: data.technologies,
        github_url: data.github_url || null,
        demo_url: data.demo_url || null,
        image_url: data.image_url || null,
        featured: data.featured,
        status: data.status,
      };

      await adminApi.updateProject(projectId, projectData);
      
      setSubmitStatus('success');
      setSubmitMessage('Project updated successfully!');
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Error updating project:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error.response?.data?.detail || 'Failed to update project. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!project) {
    return (
      <AdminRoute>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested project could not be found.</p>
            <Button asChild>
              <a href="/admin/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Project</CardTitle>
              <CardDescription>
                Update the project details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Project title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug *</FormLabel>
                          <FormControl>
                            <Input placeholder="project-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief project description"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Content (Markdown)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed project description in Markdown format"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="React, Next.js, TypeScript, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value || ''}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="github_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://github.com/username/repo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="demo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demo URL</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://demo.example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Project</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Show this project in the featured section
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Status */}
                  {submitStatus !== 'idle' && (
                    <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {submitStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <p className="text-sm">{submitMessage}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Project
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => router.push('/admin/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}
