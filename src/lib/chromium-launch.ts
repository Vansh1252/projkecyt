import chromium from '@sparticuz/chromium-min'

/**
 * Central helper that returns Puppeteer launch options suitable for local dev and serverless.
 * - In dev: use local Chrome if LOCAL_CHROMIUM_PATH is set or fall back to puppeteer default args.
 * - In serverless (Vercel): use @sparticuz/chromium-min's args + executablePath.
 */
export async function getLaunchOptions(): Promise<any> {
  const isLocal = process.env.IS_LOCAL === '1' || process.env.NODE_ENV === 'development'

  if (isLocal) {
    // Local dev — prefer a system Chrome / developer-provided path
    // precedence: LOCAL_CHROMIUM_PATH env var -> dev 'puppeteer' bundled binary -> undefined
    const localPath = process.env.LOCAL_CHROMIUM_PATH || undefined

    // Try to dynamically use the locally-installed dev `puppeteer` (if present)
    let devExecutable: string | undefined
    try {
      // dynamic import so this isn't required in production
      // (the project has a devDependency on `puppeteer` for local testing)
      // We'll call executablePath() from the full puppeteer package.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pp = await import('puppeteer')
      if (typeof pp.executablePath === 'function') {
        devExecutable = pp.executablePath()
      } else if (pp.executablePath) {
        devExecutable = pp.executablePath
      }
    } catch (e) {
      // ignore if puppeteer isn't installed locally — fall back to LOCAL_CHROMIUM_PATH
    }

    return {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
      executablePath: localPath || devExecutable || undefined,
      // keep headless in dev to make CI/local testing simpler when needed
      headless: process.env.HEADLESS !== '0',
    }
  }

  // Serverless / production — use sparticuz's recommended args and executablePath
  // The -min package doesn't include the packed binaries; you can supply
  // a remote pack URL or a filesystem path using CHROMIUM_PACK_URL.
  const packLocation = process.env.CHROMIUM_PACK_URL || undefined
  const executablePath =
    typeof chromium.executablePath === 'function'
      ? await chromium.executablePath(packLocation)
      : await chromium.executablePath

  return {
    args: (chromium.args as string[]) ?? ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
    executablePath: executablePath || undefined,
    headless: true,
    ignoreHTTPSErrors: true,
  }
}

export default getLaunchOptions
