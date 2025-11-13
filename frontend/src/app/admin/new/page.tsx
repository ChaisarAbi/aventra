'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AdminRoute } from '@/components/AdminRoute';
import { adminApi } from '@/lib/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  technologies: z.string().min(1, 'Technologies are required'),
  github_url: z.string().optional().or(z.literal('')).default(''),
  demo_url: z.string().optional().or(z.literal('')).default(''),
  featured: z.boolean().default(false),
  image_url: z.string().optional().or(z.literal('')).default(''),
  status: z.enum(['completed', 'in-progress', 'planned']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  return (
    <AdminRoute>
      <NewProjectContent />
    </AdminRoute>
  );
}

function NewProjectContent() {
  const router = useRouter();
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
      featured: false,
      image_url: '',
      status: 'completed',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Clean up empty URLs
      const submitData = {
        ...data,
        github_url: data.github_url || undefined,
        demo_url: data.demo_url || undefined,
        image_url: data.image_url || undefined,
      };

      await adminApi.createProject(submitData);
      setSubmitStatus('success');
      setSubmitMessage('Project created successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error creating project:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error.response?.data?.detail || 'Failed to create project. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Auto-generate slug if it's empty or matches the previous title
    const currentSlug = form.getValues('slug');
    if (!currentSlug || currentSlug === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground">Create a new project for your portfolio</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the details for your new project. All fields are required unless marked optional.
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
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Awesome Project" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTitleChange(e);
                          }}
                        />
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
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="my-awesome-project" {...field} />
                      </FormControl>
                      <FormDescription>
                        Used in the project URL. Must be unique.
                      </FormDescription>
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
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your project..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be shown in project cards and lists.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Content (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a detailed description of your project using Markdown..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use Markdown for formatting. This will be shown on the project detail page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="React, Next.js, TypeScript, Tailwind CSS" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of technologies used in this project.
                    </FormDescription>
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
                      <FormLabel>GitHub URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/username/repo" 
                          {...field} 
                          value={field.value || ''}
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
                      <FormLabel>Live Demo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://demo.example.com" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a project screenshot or cover image, or enter a URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
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
                        <FormDescription>
                          Show this project in the featured section on the homepage
                        </FormDescription>
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
                <div className={`flex items-center space-x-2 p-4 rounded-lg ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
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
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
