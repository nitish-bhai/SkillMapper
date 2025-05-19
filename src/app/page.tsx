"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/80 via-primary to-accent/70 text-primary-foreground p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          SkillMapper
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-primary-foreground/90">
          Unlock your career potential. Upload your resume, discover your skills, and map your path to success.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="mb-12"
      >
        <Image
          src="https://placehold.co/600x400.png"
          alt="Abstract representation of skills and connections"
          data-ai-hint="resume documents"
          width={600}
          height={400}
          className="rounded-xl shadow-2xl object-cover"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-10 py-7 text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <Link href="/upload">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
      
      <footer className="absolute bottom-6 text-center w-full text-primary-foreground/70 text-sm">
        Powered by AI &copy; {currentYear || new Date().getFullYear()} SkillMapper
      </footer>
    </div>
  );
}
