// use server'
'use server';
/**
 * @fileOverview Generates AI-powered suggestions for improving a resume based on extracted skills and job descriptions.
 *
 * - generateResumeSuggestions - A function that generates resume improvement suggestions.
 * - GenerateResumeSuggestionsInput - The input type for the generateResumeSuggestions function.
 * - GenerateResumeSuggestionsOutput - The return type for the generateResumeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSuggestionsInputSchema = z.object({
  extractedSkills: z
    .array(z.string())
    .describe('The skills extracted from the resume.'),
  jobDescription: z.string().describe('The job description to tailor the resume to.'),
});
export type GenerateResumeSuggestionsInput = z.infer<typeof GenerateResumeSuggestionsInputSchema>;

const GenerateResumeSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('AI-powered suggestions for improving the resume.'),
});
export type GenerateResumeSuggestionsOutput = z.infer<typeof GenerateResumeSuggestionsOutputSchema>;

export async function generateResumeSuggestions(
  input: GenerateResumeSuggestionsInput
): Promise<GenerateResumeSuggestionsOutput> {
  return generateResumeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeSuggestionsPrompt',
  input: {schema: GenerateResumeSuggestionsInputSchema},
  output: {schema: GenerateResumeSuggestionsOutputSchema},
  prompt: `You are a resume expert. Given the following skills extracted from a resume and a job description, provide suggestions for improving the resume to match the job description.

Extracted Skills: {{extractedSkills}}
Job Description: {{jobDescription}}

Suggestions:`,
});

const generateResumeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateResumeSuggestionsFlow',
    inputSchema: GenerateResumeSuggestionsInputSchema,
    outputSchema: GenerateResumeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
