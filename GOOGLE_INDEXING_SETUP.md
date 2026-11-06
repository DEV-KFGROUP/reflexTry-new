# Google Indexing & Search Console Bulk API Setup Guide

This guide explains how to set up the **Google Indexing API** and **Google Search Console API** to bulk submit and inspect URLs locally for `https://www.reflextry.com`.

---

## ⚡ Quick Summary of How It Works

1. **Google Indexing API** notifies Googlebot directly to crawl and re-index specific URLs (`URL_UPDATED` or `URL_DELETED`).
   - Default Quota: **200 URLs per day** (resets at midnight Pacific Time).
2. **Google Search Console (URL Inspection API)** checks whether a page is actually indexed, when it was last crawled, verdict, and detected canonical.
   - Default Quota: **2,000 queries per day**.
3. The local CLI tool is located at `scripts/bulk-indexing.mjs`. It has **zero third-party dependencies** (uses Node.js 18+ native `crypto` and `fetch`).

---

## 📋 Step 1: Create a Service Account in Google Cloud

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your existing project or click **New Project** (e.g. `reflextry-indexing`).
3. Enable the two required APIs:
   - Go to **APIs & Services > Library**.
   - Search for **Web Search Indexing API** and click **Enable**.
   - Search for **Google Search Console API** and click **Enable**.
4. Create the Service Account:
   - Go to **IAM & Admin > Service Accounts**.
   - Click **+ Create Service Account**.
   - Name: `google-indexing-bot` (or any name you prefer).
   - Click **Create and Continue**.
   - Role: Select **Viewer** (or leave default), then click **Done**.
5. Generate the JSON Private Key:
   - Click on the newly created service account.
   - Go to the **Keys** tab.
   - Click **Add Key > Create new key**.
   - Choose **JSON** and click **Create**.
   - The file will download to your computer.
6. Place the Key in Your Project:
   - Rename the downloaded file to:
     ```
     service_account.json
     ```
   - Move it into the root directory of this repository: `/Users/kaushik/Desktop/web/reflexTry-new/service_account.json`.
   - *(Note: `service_account*.json` is already added to `.gitignore` so your private key will never be committed to Git).*

---

## 🔑 Step 2: Grant Owner Access in Google Search Console (CRITICAL)

> [!IMPORTANT]
> The Service Account **MUST be added as an OWNER**, not just "Full" or "Restricted". Google's Indexing API will reject requests with `403 Permission Denied` if the service account does not have Owner permissions.

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select your property: `https://www.reflextry.com/` or `sc-domain:reflextry.com`.
3. Go to **Settings** (bottom of the left sidebar).
4. Click **Users and permissions**.
5. Click **Add user** in the top right.
6. Email: Paste your service account email address (e.g., `google-indexing-bot@your-project-id.iam.gserviceaccount.com`).
7. Permission: Select **Owner**.
8. Click **Add**.

---

## 🚀 Step 3: Run Bulk Indexing Locally

Once `service_account.json` is in place, you can use the commands below.

### 1. Test with a Dry Run (Verify Auth & Routes)
Simulates execution without consuming any Google API quota:
```bash
npm run index:dry-run
# or
node scripts/bulk-indexing.mjs submit --dry-run
```

### 2. Bulk Submit All Project Routes (Default)
Submits all tool, category, and article pages automatically:
```bash
npm run index:submit
```

### 3. Language-by-Language Bulk Indexing 🌐
Each language has **87 pages**. Since Google allows **200 URLs/day**, you can submit **2 full languages each day**:

```bash
# View all 16 supported languages & URL counts
npm run index:languages

# Submit English URLs (87 URLs)
node scripts/bulk-indexing.mjs submit --lang=en

# Submit Spanish URLs (87 URLs)
node scripts/bulk-indexing.mjs submit --lang=es

# Submit English + Spanish together (174 URLs - fits in 1 day's quota!)
node scripts/bulk-indexing.mjs submit --lang=en,es

# Dry-run test German URLs without calling Google API
node scripts/bulk-indexing.mjs submit --lang=de --dry-run

# Inspect Google Search Console index status for French URLs
node scripts/bulk-indexing.mjs inspect --lang=fr
```

#### Recommended Daily Schedule (16 Languages over 8 Days):
- **Day 1**: `node scripts/bulk-indexing.mjs submit --lang=en,es` (174 URLs)
- **Day 2**: `node scripts/bulk-indexing.mjs submit --lang=de,fr` (174 URLs)
- **Day 3**: `node scripts/bulk-indexing.mjs submit --lang=pt,it` (174 URLs)
- **Day 4**: `node scripts/bulk-indexing.mjs submit --lang=ja,ko` (174 URLs)
- **Day 5**: `node scripts/bulk-indexing.mjs submit --lang=ru,pl` (174 URLs)
- **Day 6**: `node scripts/bulk-indexing.mjs submit --lang=tr,id` (174 URLs)
- **Day 7**: `node scripts/bulk-indexing.mjs submit --lang=vi,nl` (174 URLs)
- **Day 8**: `node scripts/bulk-indexing.mjs submit --lang=zh-CN,zh-TW` (174 URLs)

### 3. Bulk Submit from Live XML Sitemap
Fetches your live sitemap and submits up to 200 URLs:
```bash
node scripts/bulk-indexing.mjs submit --sitemap=https://www.reflextry.com/sitemap.xml
```

### 4. Bulk Submit a Custom List of URLs
Create a `urls.txt` file (one URL per line) and submit:
```bash
node scripts/bulk-indexing.mjs submit --file=urls.txt
```

### 5. Submit a Single URL
```bash
node scripts/bulk-indexing.mjs submit --url=https://www.reflextry.com/reflex/reaction
```

### 6. Inspect Real-Time Index Status via Search Console
Checks whether URLs are currently indexed by Google and shows last crawl date:
```bash
# Inspect all project routes
npm run index:inspect

# Inspect a specific URL
node scripts/bulk-indexing.mjs inspect --url=https://www.reflextry.com/speed/typing
```

### 7. Remove / Delete URLs from Google's Index
```bash
node scripts/bulk-indexing.mjs delete --url=https://www.reflextry.com/old-page
```

---

## ⚙️ CLI Options & Flags

| Flag | Description | Default |
|---|---|---|
| `--sitemap <url\|path>` | Load URLs from remote URL or local sitemap file | - |
| `--file <path>` | Load URLs from custom text file | `urls.txt` (if exists) |
| `--url <url>` | Target a single URL | - |
| `--local-routes` | Use built-in routes from this repository | Enabled by default |
| `--limit <n>` | Max URLs to process in this run | `200` (Google quota) |
| `--offset <n>` | Skip first N URLs (for paginating large sites) | `0` |
| `--delay <ms>` | Milliseconds between consecutive requests | `250` |
| `--key <path>` | Path to service account JSON key | `./service_account.json` |
| `--dry-run` | Test auth and output list without sending API requests | `false` |

---

## 📊 Reports & Logs

Every execution automatically saves a full timestamped JSON log in:
```
reports/indexing-report-<timestamp>.json
```
The report includes:
- Exact HTTP status code for each URL
- Google notification timestamp
- Error messages (if any)
- Index inspection verdicts (`PASS`, `NEUTRAL`, `FAIL`)

---

## 🛠️ Common Errors & Troubleshooting

### `403 Forbidden: Permission denied`
- **Cause**: The service account email is not an Owner in Google Search Console.
- **Fix**: In Google Search Console > Settings > Users & Permissions, ensure the service account email is listed with **Owner** permissions (not Full or Restricted). Also ensure the Web Search Indexing API is enabled in Google Cloud Console.

### `429 Too Many Requests: Quota exceeded`
- **Cause**: You have reached Google's daily quota limit (default is 200 URLs per day).
- **Fix**: The script automatically stops when encountering a 429 to avoid wasting resources. Wait until midnight Pacific Time for the quota to reset, or use `--offset` and `--limit` to submit in batches across multiple days.

### `404 Not Found (on URL inspection)`
- **Cause**: The property URL in Google Search Console differs from the inspected URL format.
- **Fix**: Specify `--site-url="https://www.reflextry.com/"` or `--site-url="sc-domain:reflextry.com"`.

