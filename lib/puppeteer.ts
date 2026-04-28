import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { Browser } from 'puppeteer-core';

interface PuppeteerCache {
  browser: Browser | null;
  promise: Promise<Browser> | null;
  limiter: ConcurrencyLimiter | null;
}

declare global {
  // eslint-disable-next-line no-var
  var puppeteerBrowser: PuppeteerCache;
}

let cached = global.puppeteerBrowser;

if (!cached) {
  cached = global.puppeteerBrowser = { browser: null, promise: null, limiter: null };
}

export async function getBrowser(): Promise<Browser> {
  if (cached.browser && cached.browser.isConnected()) {
    return cached.browser;
  }

  if (!cached.promise) {
    const isLocal = process.env.NODE_ENV === 'development' || process.platform === 'win32';

    const options = isLocal
      ? {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: process.platform === 'win32' 
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : '/usr/bin/google-chrome',
          headless: true,
        }
      : {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        };

    cached.promise = puppeteer.launch(options as any).then((browser) => {
      cached.browser = browser as unknown as Browser;
      
      browser.on('disconnected', () => {
        cached.browser = null;
        cached.promise = null;
      });
      
      return cached.browser;
    });
  }

  try {
    cached.browser = await cached.promise;
    return cached.browser;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

/**
 * A simple concurrency limiter to prevent opening too many tabs at once.
 */
class ConcurrencyLimiter {
  private active = 0;
  private queue: (() => void)[] = [];
  
  constructor(private maxConcurrent: number) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }
    this.active++;
    try {
      return await fn();
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// Global limiter to persist across HMR
if (!cached.limiter) {
  cached.limiter = new ConcurrencyLimiter(5);
}

export const submissionLimiter = cached.limiter;
