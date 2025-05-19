"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
      </motion.div>

      <motion.h1 
        className="text-5xl md:text-6xl font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p 
        className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button asChild size="lg" className="rounded-full px-8 py-6 text-base group">
          <Link href="/">
            <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Go Back to Homepage
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
