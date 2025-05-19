# SkillMapper: Resume Skill Extractor

A full-stack Next.js application that lets users upload their resumes (PDF or text) and instantly extracts and visualizes key skills. The app uses serverless AI flows for skill extraction and recommendations, with a modern, responsive UI built with Tailwind CSS and rich interactive components, all deployed on Google Firebase.

---

## 🚀 Features

- **Drag-and-Drop Upload**: Seamlessly upload PDF or text resumes.
- **AI-Powered Extraction**: Serverless flows (`extract-skills-flow`) parse and identify skills from resume text.
- **Skill Suggestions**: Generate resume improvement tips via `generate-resume-suggestions` flow.
- **Visual Feedback**: View extracted skills in tags and interactive bar charts.
- **Modular UI Components**: Reusable UI primitives (alerts, accordions, dialogs) for consistency.

---

## 📦 Tech Stack

- **Next.js (App Router)** for frontend and serverless API routes
- **TypeScript** for type safety
- **Tailwind CSS** + **PostCSS** for styling
- **Shadcn/ui** components for consistent UI
- **Framer Motion** for animations
- **Recharts** for data visualization
- **OpenAI** for AI-driven suggestions
- **MonkeyLearn** (optional) for keyword enrichment
- **Firebase Hosting & Functions** for deployment

---

## 📁 Project Structure

\`\`\`
SkillMapper-master/
├── .gitignore
├── firebase.json                 # firebase hosting and functions config
├── package.json                  # app scripts & deps
├── postcss.config.mjs            # PostCSS plugins
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── .firebaserc                   # firebase project alias
└── src/
    ├── ai/
    │   ├── dev.ts                # AI flow setup
    │   ├── genkit.ts             # flow utilities
    │   └── flows/
    │       ├── extract-skills-flow.ts
    │       └── generate-resume-suggestions.ts
    ├── app/
    │   ├── layout.tsx            # root layout
    │   ├── globals.css           # global styles
    │   ├── page.tsx              # landing page
    │   ├── upload/page.tsx       # upload interface
    │   └── results/page.tsx      # results & chart page
    ├── components/
    │   ├── resume-uploader.tsx   # drag/drop & file input
    │   └── ui/                   # reusable UI components
    ├── functions/                # firebase functions for serverless flows
    │   ├── index.ts             # express adapter to trigger flows
    │   └── package.json         # functions dependencies
    └── lib/utils.ts              # shared utilities
\`\`\`

---

## 🔧 Installation & Local Development

1. **Clone repo**:
   \`\`\`bash
   git clone https://github.com/your-username/skillmapper.git
   cd SkillMapper-master
   \`\`\`
2. **Install global tools**:
   \`\`\`bash
   npm install -g firebase-tools
   \`\`\`
3. **Install dependencies**:
   \`\`\`bash
   npm install
   cd functions && npm install && cd ..
   \`\`\`
4. **Environment Variables**:
   - Create a \`.env\` file in \`functions/\` with:
     \`\`\`dotenv
     OPENAI_API_KEY=<your_openai_api_key>
     MONKEYLEARN_API_KEY=<optional_monkeylearn_api_key>
     \`\`\`
5. **Link Firebase project**:
   \`\`\`bash
   firebase login
   firebase use --add
   # select project "skillmapper-v8o9q"
   \`\`\`
6. **Run locally**:
   \`\`\`bash
   firebase emulators:start
   \`\`\`
7. Visit \`http://localhost:5000\` to test.

---

## 🛠 How It Works

### Frontend (Firebase Hosting)

- **Hosting**: Next.js pages built into static assets; configured via \`firebase.json\` to serve under Hosting.
- **API Routes**: Next.js serverless routes replaced by Firebase Functions.
- **ResumeUploader**: Sends POST to \`/api/extract-skills\` function endpoint.
- **Results Page**: Fetches from \`/api/extract-skills\` and \`/api/generate-resume-suggestions\`.

### Backend (Firebase Functions)

- **function endpoint** \`/api/extract-skills\`:
  - Triggers \`extract-skills-flow\` on uploaded text.
  - Returns JSON array of \`{ name: string; level: number }\`.
- **function endpoint** \`/api/generate-resume-suggestions\`:
  - Triggers \`generate-resume-suggestions\` flow.
  - Returns improvement suggestions.

---

## ☁️ Deployment to Firebase

1. **Build & Deploy**:
   \`\`\`bash
   npm run build         # builds next.js app
   firebase deploy       # deploys hosting and functions
   \`\`\`
2. **Hosting URLs**:
   - Frontend: https://skillmapper-v8o9q.web.app
   - Functions: https://asia-east1-skillmapper-v8o9q.cloudfunctions.net
3. **Console**:
   - Frontend overview: https://console.firebase.google.com/project/skillmapper-v8o9q/hosting
   - Functions overview: https://console.firebase.google.com/project/skillmapper-v8o9q/functions

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch: \`git checkout -b feature/your-feature\`  
3. Commit: \`git commit -m "feat: add your feature"\`  
4. Push & PR  

---

## 📄 License

MIT © [Your Name]
