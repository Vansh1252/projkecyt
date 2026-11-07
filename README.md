<h1 align="center">AI Business Onboarding & Proposal Generator</h1>

<p align="center">
  A Next.js app that walks a business through a short onboarding flow, uses OpenAI to recommend the right bookkeeping and finance services, and generates a branded PDF report that is emailed to the client.
</p>

<p align="center">
  <a href="https://projkecyt.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Visit_Site-000000?style=for-the-badge&logo=vercel&logoColor=white"/></a>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

---

## How it works

1. **Company information:** the user enters basic company details
2. **About the business:** industry, size and how the business operates
3. **Current setup:** the tools and processes they use today
4. **Service selection:** Intelligent Bookkeeping is always included, and **OpenAI suggests add-on services** based on the answers, which the user can apply with one click
5. **Result screen:** a summary of the recommended package
6. **PDF report and email:** a PDF is generated and emailed to the user with Resend, and the lead can be sent to Zapier

## Features

- Multi-step onboarding form with Formik and Yup/Zod validation
- AI service recommendations from the OpenAI API
- PDF generation with both @react-pdf/renderer and headless Chromium (Puppeteer + @sparticuz/chromium-min, so it runs on serverless)
- Transactional email with Resend
- Supabase for storing submissions and reports
- Redux Toolkit for form state across steps
- Charts with Recharts and accessible UI with React Aria components
- Zapier webhook integration
- Docker, Docker Compose, a Makefile, commitlint and GitLab CI

## API routes

| Route | Purpose |
|---|---|
| `/api/user_input` | Save the onboarding answers |
| `/api/about_page` | Save business details |
| `/api/ai_suggestion` | Get AI service recommendations |
| `/api/review_input/[id]` | Review a saved submission |
| `/api/report`, `/api/report/[id]` | Create and fetch reports |
| `/api/create-pdf`, `/api/pdf/[id]`, `/api/download-pdf` | Generate and download the PDF |
| `/api/email` | Email the report |

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, Untitled UI icons, React Aria |
| State and forms | Redux Toolkit, Formik, Yup, Zod |
| AI | OpenAI API |
| Data | Supabase |
| PDF | @react-pdf/renderer, Puppeteer Core, @sparticuz/chromium-min |
| Email | Resend |
| DevOps | Docker, Docker Compose, GitLab CI, Vercel |

## Getting started

**Prerequisites:** Node.js 18+, a Supabase project, and OpenAI and Resend API keys

~~~bash
git clone https://github.com/Vansh1252/projkecyt.git
cd projkecyt
npm install
~~~

Create a `.env.local` file:

~~~env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=reports@yourdomain.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...
# plus your Supabase URL and anon key
~~~

Run it:

~~~bash
npm run dev      # http://localhost:3000
npm run build && npm start
~~~

Or with Docker:

~~~bash
docker compose up --build
~~~

## Author

**Vansh Jain**: [GitHub](https://github.com/Vansh1252) · sanklechav65@gmail.com
