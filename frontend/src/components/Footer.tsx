'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Abi. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/chaisarabi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            
            <Link
              href="https://linkedin.com/in/chaisar-abi-prasetyo-b26595333"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            
            <Link
              href="mailto:chaisarabi2304@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
