# 📄 ResumeCraft AI

### Build smarter resumes. Analyze them. Tailor them with AI.

ResumeCraft AI is a modern, AI-powered resume builder built with React and Vite. It helps users create professional resumes, customize them using multiple templates, analyze resume quality, tailor content for job descriptions, improve resume sections with AI, and export polished resumes as PDF.

The application combines structured resume building, ATS-focused analysis, AI assistance, responsive design, and local persistence into one complete resume workspace.

---

## ✨ Features

### 🏠 Home & Workspace

- Clean and responsive landing experience
- Workspace overview for resume activity
- View recently created resumes
- Quick access to resume creation
- Easy navigation to resumes, templates, and settings
- Resume analysis status displayed in the workspace

### 📄 Resume Management

- Create multiple resumes
- Edit existing resumes
- Rename resumes
- Duplicate resumes
- Delete resumes with confirmation
- Search through saved resumes
- Persistent resume storage
- Helpful empty state when no resumes exist
- Automatic resume naming based on resume information

### ✍️ Resume Builder

Build resumes using structured sections for:

- Personal Information
- Professional Summary
- Experience
- Education
- Projects
- Skills
- Certifications
- Languages
- Job Target

The builder provides a live resume preview while editing your information.

### 🎨 30 Resume Templates

ResumeCraft AI includes **30 customizable resume templates** across multiple design styles.

Available templates include:

- Air
- Architect
- Authority
- Canvas
- Chronicle
- Classic
- Clean
- Corporate
- Developer
- Engineer
- Executive
- Heritage
- Horizon
- Metro
- Minimal
- Modern
- Mono
- Muse
- Nova
- Oxford
- Professional
- Pure
- Spectrum
- Stack
- Sterling
- Studio
- Terminal
- Timeless
- Vertex
- Vivid

Templates can be explored using categories including:

- Modern
- Professional
- Minimal
- Classic
- Creative
- Technical

Users can search templates and apply a selected template directly to a resume.

### 🎛️ Resume Customization

Resume appearance can be customized while maintaining the selected template structure.

Customization includes:

- Template selection
- Accent color customization
- Resume preview updates
- Persistent customization settings

### 🤖 AI-Powered Resume Assistance

ResumeCraft AI integrates Gemini-powered assistance through secure server-side API routes.

AI functionality is available across five major areas.

#### Professional Summary

- Rewrite professional summaries
- Improve clarity and professionalism
- Review the generated result before applying it
- Apply or discard AI suggestions

#### Experience

- Improve experience descriptions
- Strengthen wording while preserving the user's original facts
- Support structured bullet-style descriptions
- Prevent near-duplicate recommendations

#### Projects

- Improve project descriptions
- Produce clearer and more professional project content
- Preserve technologies and project facts supplied by the user
- Review suggestions before applying them

#### Skills

- Recommend relevant missing skills
- Avoid suggesting skills already present
- Require evidence from the user's experience or projects
- Prevent unsupported job-description keywords from being automatically added
- Allow users to explicitly add recommended skills

#### Job / Resume Tailoring

- Compare resume content with a target job description
- Generate tailored recommendations
- Suggest improvements for relevant resume sections
- Preserve user control over every recommendation
- Track analysis after successful AI tailoring

AI-generated content is never silently applied to the resume.

---

## 📊 ATS & Resume Analysis

ResumeCraft AI includes deterministic resume analysis to help users understand the quality and relevance of their resume.

Analysis includes:

- Overall resume score
- Score breakdown
- Content analysis
- Impact analysis
- Evidence analysis
- Keyword analysis for targeted resumes
- Job-description comparison
- Improvement suggestions
- Tailoring recommendations

General resume analysis and job-targeted analysis use different scoring criteria so the results remain relevant to the current workflow.

---

## 🎯 Job Targeting

Users can provide a target job description to evaluate how well their resume aligns with a specific role.

The application can:

- Analyze important job-description keywords
- Compare those keywords with resume content
- Identify relevant gaps
- Generate AI tailoring recommendations
- Improve supported resume content without inventing experience
- Maintain the original facts entered by the user

---

## 📥 Resume Import

ResumeCraft AI includes a resume import workflow for bringing existing resume information into the application.

The import system includes:

- Resume import dialog
- PDF text extraction
- Resume text parsing
- Import preview
- Structured resume-data conversion
- Review before using imported information

---

## 📤 PDF Export

Completed resumes can be exported as PDF directly from the builder.

The PDF export system includes:

- Template-aware resume capture
- Consistent document dimensions
- Desktop export support
- Mobile export support
- Protection against mobile preview scaling affecting the exported document
- Resume styling preserved during export

---

## 💾 Local Persistence

ResumeCraft AI stores application data locally so users can continue working without creating an account.

Persistent data includes:

- Resumes
- Active resume
- Resume content
- Selected templates
- Resume customization
- Application preferences

---

## ⚙️ Settings

The Settings page provides application-level preferences including:

### Theme

- Light
- Dark
- System

### Accessibility

- Reduced motion preference

### Resume Defaults

- Default resume template
- Default accent color

### Data Management

- Export application backup
- Restore application backup
- Reset settings

The backup system preserves resume data together with supported application preferences.

---

## ♿ Accessibility

Accessibility considerations are included throughout the application.

Implemented improvements include:

- Keyboard-friendly interactions
- Focus management
- Accessible dialogs
- Reduced-motion support
- Responsive controls
- Semantic UI structure
- Clear interactive states

---

## 📱 Responsive Design

ResumeCraft AI is designed to work across desktop and mobile layouts.

Responsive behavior has been tested across:

- Home
- My Resumes
- Templates
- Settings
- Resume Builder
- Analysis
- Resume forms
- Resume preview
- Dialogs
- PDF export

The application has also been tested at narrow mobile viewport sizes, including **320 × 568**.

---

## 🔐 AI Security

The Gemini API key is never exposed directly in the React client.

AI requests use server-side API routes:

```text
/api/rewrite-summary
/api/improve-experience
/api/improve-project
/api/recommend-skills
/api/tailor-resume
```

Shared Gemini configuration is handled through:

```text
/api/_utils/gemini.js
```

The API key is read securely from:

```text
GEMINI_API_KEY
```

through server-side environment variables.

Local environment files are excluded from Git using `.gitignore`.

---

## 🔄 Gemini Model Fallback

ResumeCraft AI includes shared fallback handling for Gemini requests.

Configured models include:

```text
gemini-3.6-flash
gemini-3.5-flash
gemini-3.5-flash-lite
gemini-3.1-flash-lite
```

Fallback handling is used for supported temporary API conditions such as rate limits or service availability issues.

---

## 🧠 AI Design Principles

AI functionality in ResumeCraft AI follows several important rules:

- AI never silently overwrites resume content
- Users explicitly apply or discard suggestions
- Existing resume facts are preserved
- Unsupported employers are not invented
- Unsupported technologies are not added
- Unsupported certifications are not generated
- Unsupported metrics are not fabricated
- Skill recommendations require evidence from resume content
- Job-description keywords alone are not treated as proof of experience

This keeps AI assistance useful while leaving the final resume under the user's control.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

### Routing

- React Router

### State Management

- Zustand

### Forms & Validation

- React Hook Form
- Zod

### Icons

- Lucide React

### AI

- Google Gemini
- Server-side Vercel API routes

### PDF & Resume Processing

- HTML-based resume rendering
- PDF export utilities
- PDF text extraction
- Resume text parsing

### Testing & Quality

- Vitest
- React Testing Library
- ESLint

### Deployment

- Vercel

---

## 📁 Project Structure

```text
resumecraft-ai/
│
├── api/
│   ├── _utils/
│   │   └── gemini.js
│   ├── improve-experience.js
│   ├── improve-project.js
│   ├── recommend-skills.js
│   ├── rewrite-summary.js
│   └── tailor-resume.js
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── builder/
│   │   │   ├── analysis/
│   │   │   ├── customization/
│   │   │   ├── forms/
│   │   │   └── templates/
│   │   ├── home/
│   │   ├── import/
│   │   ├── layout/
│   │   ├── resumes/
│   │   └── ui/
│   │
│   ├── data/
│   ├── pages/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── stores/
│   ├── test/
│   └── utils/
│       ├── ats/
│       └── resumeImport/
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/triharsha/resumecraft-ai.git
```

### 2. Navigate to the project

```bash
cd resumecraft-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the environment variable

Create a local environment file:

```text
.env.local
```

Add your Gemini API key:

```text
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit `.env.local` or expose the API key in client-side code.

### 5. Run with Vercel development environment

Because ResumeCraft AI uses server-side API routes for AI functionality, run:

```bash
npx vercel dev
```

Then open:

```text
http://localhost:3000
```

---

## 🧪 Testing

The project includes automated tests covering important application behavior such as:

- Resume state management
- Resume persistence
- Builder behavior
- Resume management
- Settings
- Confirmation dialogs
- Resume import
- PDF export
- Resume customization
- ATS analysis
- Keyword analysis
- Job tailoring
- Template registry

Run the complete test suite with:

```bash
npm test
```

Current validated test result:

```text
18 / 18 test files passed
570 / 570 tests passed
```

---

## 🔍 Code Quality

Run ESLint with:

```bash
npm run lint
```

Latest production validation:

```text
ESLint: PASS
```

---

## 📦 Production Build

Create a production build with:

```bash
npm run build
```

Latest production validation:

```text
Vite v8.2.2
2206 modules transformed
Production build: PASS
```

The generated production files are placed in:

```text
dist/
```

---

## ✅ Quality Assurance

ResumeCraft AI has undergone manual and automated QA across the main application workflows.

Validated areas include:

- Home navigation
- Resume creation
- Resume editing
- Resume search
- Rename
- Duplicate
- Delete
- Template search
- Template filtering
- Template selection
- Resume customization
- Settings persistence
- Backup and restore
- Empty states
- Confirmation dialogs
- ATS analysis
- Job tailoring
- Summary AI
- Experience AI
- Project AI
- Skills AI
- PDF export
- Mobile PDF export
- Responsive layouts
- Navigation
- Error handling

---

## 📌 Current Project Status

ResumeCraft AI currently includes:

- ✅ Core resume builder
- ✅ Resume management
- ✅ 30 resume templates
- ✅ Resume customization
- ✅ ATS analysis
- ✅ Keyword analysis
- ✅ Job targeting
- ✅ AI summary rewriting
- ✅ AI experience improvement
- ✅ AI project improvement
- ✅ AI skill recommendations
- ✅ AI resume tailoring
- ✅ Resume import
- ✅ PDF export
- ✅ Backup and restore
- ✅ Theme and accessibility settings
- ✅ Responsive/mobile support
- ✅ Automated testing
- ✅ Production lint validation
- ✅ Production build validation
- ✅ Git repository setup
- ✅ GitHub repository
- ⏳ Vercel deployment
- ⏳ Production smoke testing

---

## 🌐 Deployment

ResumeCraft AI is prepared for deployment using Vercel.

The production deployment requires the following environment variable:

```text
GEMINI_API_KEY
```

The key should be configured through the Vercel project environment settings and must never be committed to the repository.

The production URL will be added here after deployment.

---

## 👨‍💻 Author

**Triharsha**

Full Stack Developer & Java Enthusiast

GitHub: [@triharsha](https://github.com/triharsha)

---

## 📄 License

This project is currently provided as a portfolio and educational project.

---

### ⭐ ResumeCraft AI

**Create. Analyze. Tailor. Improve.**