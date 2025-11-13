'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { publicApi } from '@/lib/api';
import { Project } from '@/types';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Zap } from 'lucide-react';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await publicApi.getProjects(true);
        setFeaturedProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        // Fallback to empty array
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const skills = [
    { name: 'Frontend Development', icon: Globe, description: 'React, Next.js, TypeScript' },
    { name: 'Backend Development', icon: Database, description: 'FastAPI, Python, SQL' },
    { name: 'Machine Learning', icon: Zap, description: 'Scikit-learn, TensorFlow' },
    { name: 'DevOps', icon: Code, description: 'Docker, CI/CD, Cloud' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Abi Prasetyo
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Full-Stack Developer & Machine Learning Enthusiast
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            I build modern web applications and machine learning solutions that solve real-world problems. 
            Passionate about clean code, user experience, and innovative technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/projects">View My Work</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I work with a variety of technologies across the full stack
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <skill.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Some of my recent work that I'm particularly proud of
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured projects yet</p>
            <Button asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Start a Conversation</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
