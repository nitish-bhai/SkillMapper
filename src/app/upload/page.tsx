import { ResumeUploader } from "@/components/resume-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,0px))]">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <FileText size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Upload Your Resume</CardTitle>
          <CardDescription className="text-lg">
            Let SkillMapper analyze your resume and extract key skills. Supports PDF and TXT formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploader />
        </CardContent>
      </Card>
    </div>
  );
}
