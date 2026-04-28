import puppeteer, { Browser } from 'puppeteer';

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
    cached.promise = puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    }).then((browser) => {
      cached.browser = browser;
      
      browser.on('disconnected', () => {
        cached.browser = null;
        cached.promise = null;
      });
      
      return browser;
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
