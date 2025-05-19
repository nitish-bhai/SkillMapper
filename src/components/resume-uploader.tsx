"use client";

import { useState, useCallback, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ResumeUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt")) {
        setError("Invalid file type. Only .pdf or .txt files are allowed.");
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        });
        return;
      }
      setError(null);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // IMPORTANT: Replace with your actual backend URL in a real deployment
        const response = await fetch("http://localhost:8000/api/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: "Failed to extract skills. Server returned an error." }));
          throw new Error(errorData.detail || `HTTP error ${response.status}`);
        }

        const json = await response.json();
        
        if (!json.skills || !Array.isArray(json.skills)) {
          throw new Error("Invalid response format from server.");
        }

        toast({
          title: "Skills Extracted!",
          description: "Your skills have been successfully extracted.",
        });
        router.push(`/results?skills=${encodeURIComponent(JSON.stringify(json.skills))}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Failed to extract skills: ${errorMessage}`);
        toast({
          title: "Extraction Failed",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Extraction error:", err);
      } finally {
        setLoading(false);
      }
    },
    [router, toast]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer?.files[0] || null);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`w-full p-8 md:p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out
          ${isDragging ? "border-primary bg-primary/10" : "border-input hover:border-primary/70"}
          ${error ? "border-destructive" : ""}`}
        whileHover={{ scale: 1.02 }}
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById("fileInput")?.click()}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("fileInput")?.click()}
      >
        <input
          type="file"
          onChange={onFileChange}
          className="hidden"
          id="fileInput"
          accept=".pdf,.txt"
          disabled={loading}
        />
        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
          <UploadCloud className={`w-12 h-12 mb-3 ${isDragging ? "text-primary" : ""}`} />
          <p className="text-lg font-medium">
            <span className="text-primary font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm">PDF or TXT (MAX. 5MB)</p>
        </div>
      </motion.div>

      {loading && (
        <div className="flex items-center text-primary">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <p className="text-lg">Extracting skills, please wait...</p>
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && (
        <Button 
          onClick={() => document.getElementById("fileInput")?.click()}
          disabled={loading}
          size="lg"
          className="w-full max-w-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Select Resume File"
          )}
        </Button>
      )}
    </div>
  );
}
