This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local development: PDF / Puppeteer

The project uses server-side Chromium via `@sparticuz/chromium-min` + `puppeteer-core` for generating PDFs on serverless platforms. This combination lets the function stay small enough to deploy in constrained hosts (e.g. Vercel) when configured correctly.

- To install dependencies (after the fix in package.json) run:

```bash
npm install
```

- For local development you have two options so `puppeteer-core` can find a Chromium binary:
	1. Install Chrome / Chromium on your machine (system-installed binary will be used by puppeteer-core), or
	2. Install full `puppeteer` as a dev dependency which downloads a Chromium binary suitable for local testing:

```bash
npm install --save-dev puppeteer
```

When you deploy to Vercel this project can use a serverless-compatible Chromium binary (via `@sparticuz/chromium-min`) so you don't need the full `puppeteer` there — but note the `-min` package doesn't include the packed binaries. See the code comments and `src/lib/chromium-launch.ts` for how the executable path is resolved (you may need to provide a remote pack URL or a system path for your runtime).

If you're using `@sparticuz/chromium-min` you can set the environment variable `CHROMIUM_PACK_URL` in your Vercel project to point to a hosted chromium-pack tar file (or provide a local path via `LOCAL_CHROMIUM_PATH` for local dev). The helper `src/lib/chromium-launch.ts` will pass that value to `chromium.executablePath()` so it can download and extract the pack on first run.

Local development helper
- For local testing install the full `puppeteer` package as a dev dependency so a Chromium binary is available (you already did this with `npm install --save-dev puppeteer`).
- The helper detects local dev (NODE_ENV=development or IS_LOCAL=1). It will prefer `LOCAL_CHROMIUM_PATH` if set, otherwise it tries to find the dev `puppeteer` bundle executable.
- You can run the app locally in headless mode by setting HEADLESS=1, or run headful mode with HEADLESS=0. Example:

```bash
IS_LOCAL=1 HEADLESS=1 npm run dev
```
