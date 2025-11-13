'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { publicApi } from '@/lib/api';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await publicApi.getProjects();
        setProjects(response.data || []);
        setFilteredProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply featured filter
    if (featuredFilter !== 'all') {
      const isFeatured = featuredFilter === 'featured';
      filtered = filtered.filter(project => project.featured === isFeatured);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, featuredFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFeaturedFilter('all');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of projects I've worked on, ranging from web applications to machine learning solutions.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== 'all' || featuredFilter !== 'all') && (
            <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {projects.length === 0 
              ? "No projects have been added yet." 
              : "No projects match your current filters."
            }
          </p>
          {(searchTerm || statusFilter !== 'all' || featuredFilter !== 'all') && (
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Stats */}
      {!loading && projects.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
      )}
    </div>
  );
}
