'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { adminApi, authUtils } from '@/lib/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loginMessage, setLoginMessage] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginStatus('idle');

    try {
      const response = await adminApi.login(data);
      const { access_token } = response.data;
      
      authUtils.setToken(access_token);
      setLoginStatus('success');
      setLoginMessage('Login successful! Redirecting...');
      
      // Redirect to admin dashboard after successful login
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginStatus('error');
      if (error.response?.status === 401) {
        setLoginMessage('Invalid username or password. Please try again.');
      } else {
        setLoginMessage(
          error.response?.data?.detail || 'Login failed. Please check your credentials.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            Access the admin dashboard to manage your portfolio
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Login Status */}
                {loginStatus !== 'idle' && (
                  <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                    loginStatus === 'success' 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {loginStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <p className="text-sm">{loginMessage}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Forgot your credentials? Check the backend environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}
