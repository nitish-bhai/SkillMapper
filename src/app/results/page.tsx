
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, ListChecks, ArrowLeft, TrendingUp, Info, X as CloseIcon, Loader2 as SpinnerIcon } from "lucide-react"; // Renamed Loader2 to avoid conflict
import { Badge } from "@/components/ui/badge";

interface Skill {
  name: string;
  level: number;
  description: string; // UI expects a string, will default to "" if null/undefined
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const skillsParam = searchParams.get("skills");
    if (skillsParam) {
      try {
        const parsedSkillsInput = JSON.parse(decodeURIComponent(skillsParam));
        
        if (Array.isArray(parsedSkillsInput)) {
          const validatedSkills: Skill[] = [];
          for (const s of parsedSkillsInput) {
            let currentName: string | undefined = undefined;
            let currentLevel: number | undefined = undefined;
            let currentDescription: string = ""; // Default to empty string

            if (typeof s.name === 'string' && s.name.trim() !== '') {
              currentName = s.name.trim();
            }

            if (typeof s.level === 'number') {
              currentLevel = s.level;
            } else if (typeof s.level === 'string') {
              const parsedNum = parseInt(s.level, 10);
              if (!isNaN(parsedNum)) {
                currentLevel = parsedNum;
              }
            }
            
            if (typeof s.description === 'string') {
              currentDescription = s.description;
            } else if (s.description === null) { // Handle null description
               currentDescription = "";
            }
            // If s.description is undefined, currentDescription remains ""

            if (currentName !== undefined && currentLevel !== undefined) {
              validatedSkills.push({
                name: currentName,
                level: currentLevel,
                description: currentDescription,
              });
            } else {
              console.warn("Invalid skill data encountered and skipped:", s);
            }
          }

          if (validatedSkills.length > 0 || parsedSkillsInput.length === 0) {
            setSkills(validatedSkills);
          } else {
            console.error("All parsed skills were invalid. Original data:", parsedSkillsInput);
            router.replace("/upload");
          }
        } else {
          console.error("Parsed skills data is not an array:", parsedSkillsInput);
          router.replace("/upload");
        }
      } catch (error) {
        console.error("Failed to parse skills from query params:", error);
        router.replace("/upload");
      }
    }
    // No specific redirection if skillsParam is missing, will fall through to "No Skills Data" if skills array is empty.
    setIsLoading(false);
  }, [searchParams, router]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <SpinnerIcon className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading results...</p>
      </div>
    );
  }
  
  if (skills.length === 0 && !isLoading) {
     return (
      <div className="text-center py-10">
        <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No Skills Data</h3>
        <p className="text-muted-foreground mb-6">
          It seems no skills data was provided or found. Please try uploading your resume again.
        </p>
        <Button asChild>
          <Link href="/upload">
            <ArrowLeft className="mr-2 h-4 w-4" /> Upload Another Resume
          </Link>
        </Button>
      </div>
    );
  }
  
  const sortedSkillsForChart = [...skills].sort((a, b) => b.level - a.level).slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="outline" asChild className="mb-8 group">
          <Link href="/upload">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Upload Another Resume
          </Link>
        </Button>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Tag className="h-8 w-8 text-primary mr-3" />
              <CardTitle className="text-3xl font-bold">Detected Skills</CardTitle>
            </div>
            <CardDescription className="text-md">
              Here are the skills extracted from your resume. Click on a skill to see more details. Levels indicate occurrences or proficiency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={`${skill.name}-${index}`} // Ensure unique key if names can repeat
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="relative"
                  >
                    <Badge 
                      variant="secondary" 
                      className="px-4 py-2 text-sm rounded-full shadow-sm cursor-pointer"
                      onClick={() => setSelectedSkill(skill)}
                    >
                      {skill.name} <span className="ml-1.5 text-xs opacity-75">({skill.level})</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No skills were detected in the uploaded document.</p>
            )}
          </CardContent>
        </Card>

        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="my-8"
          >
            <Card className="shadow-lg border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Info className="h-6 w-6 text-primary mr-2 shrink-0" />
                    <CardTitle className="text-2xl">Skill Details: {selectedSkill.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedSkill(null)} aria-label="Close skill details">
                    <CloseIcon className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-md text-foreground">{selectedSkill.description || "No description provided for this skill."}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {sortedSkillsForChart.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary mr-3" />
                <CardTitle className="text-3xl font-bold">Skills Proficiency/Frequency</CardTitle>
              </div>
              <CardDescription className="text-md">
                A visual representation of your top skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedSkillsForChart}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                    barSize={30}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                      interval={0}
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} 
                    />
                    <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.3 }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                    <Bar dataKey="level" name="Level/Frequency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

// Using SpinnerIcon imported from lucide-react as Loader2
// function Loader2({ className }: { className?: string }) { // Original Loader2 component, now replaced by SpinnerIcon
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//     </svg>
//   );
// }

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SpinnerIcon className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading results...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

    