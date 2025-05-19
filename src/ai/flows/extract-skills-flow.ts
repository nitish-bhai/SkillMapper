'use server';
/**
 * @fileOverview Extracts skills from resume content using AI.
 *
 * - extractSkillsFromResume - A function that takes resume content and extracts skills.
 * - ExtractSkillsInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Skill schema
const SkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
  level: z.number().describe('A numerical representation of proficiency or frequency of the skill, e.g., on a scale of 1-5 or count of mentions.'),
  description: z.string().describe('A brief (1-2 sentences) description or context of how this skill is mentioned or demonstrated in the resume.'),
});

const ExtractSkillsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The content of the resume as a data URI. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z.array(SkillSchema).describe('An array of skills extracted from the resume, including their names, levels, and descriptions.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkillsFromResume(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an expert resume analyst. Your task is to extract key skills from the provided resume content.
For each skill, identify its name, assign a proficiency level or frequency score (as a number, for example, from 1 to 5 based on how emphasized it is, or a count of mentions), and provide a brief (1-2 sentences) description or context for how this skill is mentioned or demonstrated in the resume.
Prioritize technical skills, software proficiency, and significant soft skills.

Resume Content:
{{media url=resumeDataUri}}

Please provide the output as a structured list of skills with their names, levels, and descriptions. Ensure the output is a JSON object matching the defined schema.
`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return any output for skill extraction.");
    }
    // Ensure skills is an array, even if empty, to match schema
    if (!output.skills) {
        return { skills: [] };
    }
    return output;
  }
);
