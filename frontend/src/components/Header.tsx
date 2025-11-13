'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            AVENTRA
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              href="/projects" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Projects
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden md:flex">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
