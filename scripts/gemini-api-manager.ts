import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

/**
 * Loads .env.local manually if not already populated in process.env
 */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvLocal();

export interface KeyStats {
  keyMask: string;
  requestsCount: number;
  tokensUsed: number;
  limitReached: boolean;
  lastError?: string;
}

export class GeminiKeyPoolManager {
  private keys: string[] = [];
  private activeKeyIndex: number = 0;
  private model: string = 'gemini-3.5-flash-lite';
  private stats: KeyStats[] = [];

  constructor() {
    this.initKeys();
  }

  private initKeys() {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    this.keys = rawKeys
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    if (this.keys.length === 0) {
      throw new Error('❌ No Gemini API keys found in GEMINI_API_KEYS or GEMINI_API_KEY.');
    }

    this.model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    this.stats = this.keys.map(k => ({
      keyMask: k.slice(0, 8) + '...' + k.slice(-6),
      requestsCount: 0,
      tokensUsed: 0,
      limitReached: false,
    }));

    console.log(`\n======================================================`);
    console.log(`🔑 Gemini Multi-Key Pool Initialized`);
    console.log(`⚡ Model: ${this.model}`);
    console.log(`📊 Total Keys in Rotation Pool: ${this.keys.length}`);
    this.stats.forEach((s, idx) => {
      console.log(`   [Key #${idx + 1}] ${s.keyMask} (Status: Ready)`);
    });
    console.log(`======================================================\n`);
  }

  public getActiveKeyIndex(): number {
    return this.activeKeyIndex;
  }

  public getActiveKeyMask(): string {
    return this.stats[this.activeKeyIndex].keyMask;
  }

  /**
   * Switches to the next available API key when the current key hits a limit
   */
  public rotateToNextKey(reason: string): boolean {
    const prevIdx = this.activeKeyIndex;
    this.stats[prevIdx].limitReached = true;
    this.stats[prevIdx].lastError = reason;

    console.warn(`\n⚠️  [FAILOVER TRIGGERED] Key #${prevIdx + 1} (${this.stats[prevIdx].keyMask}) limit reached: ${reason}`);

    // Check if next key exists
    if (this.activeKeyIndex + 1 < this.keys.length) {
      this.activeKeyIndex++;
      console.log(`🔄 Automatically switched ➔ Key #${this.activeKeyIndex + 1} (${this.getActiveKeyMask()})`);
      return true;
    } else {
      console.warn(`⚠️ All ${this.keys.length} API keys in the pool have reached their rate/quota limits.`);
      return false;
    }
  }

  /**
   * Reset limits after a cooling period
   */
  public resetPool() {
    console.log(`♻️ Resetting rate-limit flags for all keys in pool.`);
    this.activeKeyIndex = 0;
    this.stats.forEach(s => {
      s.limitReached = false;
    });
  }

  /**
   * Low-level raw request to Google Gemini API
   */
  private makeRequest(key: string, payload: object): Promise<{ statusCode: number; data: any; raw: string }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(payload);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;

      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 60000, // 60s timeout
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            resolve({ statusCode: res.statusCode || 200, data, raw });
          } catch (e) {
            resolve({ statusCode: res.statusCode || 500, data: null, raw });
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out after 60s'));
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(body);
      req.end();
    });
  }

  /**
   * Execute generation with automatic failover across Key 1 -> Key 2 -> Key 3
   */
  public async generateContent(
    payload: object,
    maxRetriesAllKeys: number = 3
  ): Promise<any> {
    let cycleAttempt = 0;

    while (cycleAttempt < maxRetriesAllKeys) {
      const currentKey = this.keys[this.activeKeyIndex];
      const currentStats = this.stats[this.activeKeyIndex];

      try {
        currentStats.requestsCount++;
        const res = await this.makeRequest(currentKey, payload);

        // 1. Success case
        if (res.statusCode === 200 && res.data) {
          if (res.data.usageMetadata?.totalTokenCount) {
            currentStats.tokensUsed += res.data.usageMetadata.totalTokenCount;
          }
          return res.data;
        }

        // 2. Limit / Quota / Rate limit error detection
        const errorMsg = res.data?.error?.message || res.raw || `HTTP ${res.statusCode}`;
        const isRateLimit =
          res.statusCode === 429 ||
          res.statusCode === 403 ||
          errorMsg.includes('RESOURCE_EXHAUSTED') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('rate limit');

        if (isRateLimit) {
          const switched = this.rotateToNextKey(errorMsg);
          if (switched) {
            // Immediate retry with the next key
            continue;
          } else {
            // All keys reached limit -> cooling period before recycling
            cycleAttempt++;
            console.log(`⏳ Cooling down for 45 seconds before recycling key pool (Cycle ${cycleAttempt}/${maxRetriesAllKeys})...`);
            await new Promise(r => setTimeout(r, 45000));
            this.resetPool();
            continue;
          }
        }

        // Other non-rate-limit error (e.g. 500 or bad format)
        throw new Error(`Gemini API Error (HTTP ${res.statusCode}): ${errorMsg}`);
      } catch (err: any) {
        if (err.message && (err.message.includes('timed out') || err.message.includes('ECONNRESET'))) {
          console.warn(`⚠️ Network glitch on Key #${this.activeKeyIndex + 1}. Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw err;
      }
    }

    throw new Error('❌ Exhausted all API keys and retry cycles.');
  }

  /**
   * Helper: Translate JSON object cleanly with preserved structure
   */
  public async translateJson(
    targetLanguage: string,
    targetCode: string,
    jsonObject: object,
    contextInfo: string = 'General Web & Gaming App UI'
  ): Promise<any> {
    const prompt = `You are a professional localization expert and gamer translator.
Translate the following JSON content from English into ${targetLanguage} (locale: ${targetCode}).

Context: ${contextInfo}

STRICT TRANSLATION RULES:
1. Return ONLY valid JSON matching the exact schema and keys of the input.
2. DO NOT translate keys, only string values.
3. Keep all HTML tags, JSX tags, and markdown formatting intact (e.g. <b>, <code>, [text](url)).
4. Keep standard gamer terminology natural for the target audience (e.g., CPS, WPM, Flick Shot, Go/No-Go, Chimp Test).
5. For SEO titles and descriptions, translate naturally for local search engines.
6. Do NOT include markdown code fences or commentary.

Input JSON:
${JSON.stringify(jsonObject, null, 2)}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    };

    const result = await this.generateContent(payload);
    const candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error(`No content generated for ${targetLanguage}`);
    }

    return JSON.parse(candidateText.trim());
  }

  /**
   * Print pool summary
   */
  public printSummary() {
    console.log(`\n================== Gemini API Pool Summary ==================`);
    this.stats.forEach((s, idx) => {
      const activeMark = idx === this.activeKeyIndex ? ' (CURRENT ACTIVE)' : '';
      const status = s.limitReached ? '❌ LIMIT REACHED' : '✅ AVAILABLE';
      console.log(`Key #${idx + 1} [${s.keyMask}]${activeMark}:`);
      console.log(`   Requests: ${s.requestsCount} | Est. Tokens: ${s.tokensUsed} | Status: ${status}`);
      if (s.lastError) console.log(`   Last Error: ${s.lastError.slice(0, 100)}...`);
    });
    console.log(`=============================================================\n`);
  }
}

// Export singleton
export const geminiPool = new GeminiKeyPoolManager();
