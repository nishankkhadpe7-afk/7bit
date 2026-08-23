# 7bit Media

Premium portfolio site for a video post-production studio.

## Architecture

```
7Bit Frontend (React/Vite)
       ↓ (POST /api/contact)
7Bit Backend (Express/Node.js)
       ↓ (HTTPS POST Webhook)
Google Apps Script Web App
       ├── Writes to Private Google Sheet
       └── Sends Gmail Notifications (via MailApp BCC)
```

The public frontend features graceful local fallbacks, ensuring the portfolio is always presentable even if the backend is offline. Static endpoints `/api/projects`, `/api/services`, and `/api/settings` serve data directly without database overhead.

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` values into `client/.env` and `server/.env` as appropriate.
   - For `server/.env`, ensure `GOOGLE_SHEETS_WEBHOOK_URL` points to your deployed Google Apps Script Web App URL.
3. **Run development server**:
   ```bash
   npm run dev
   ```

## Google Sheets & Apps Script Setup

1. Create a private Google Sheet.
2. Navigate to **Extensions -> Apps Script**.
3. Paste the Apps Script code found in `walkthrough.md`.
4. In **Project Settings** (gear icon), add a script property:
   - **Property**: `NOTIFICATION_EMAILS`
   - **Value**: A comma-separated list of recipient emails (e.g. `7bit.media.co@gmail.com,niahankkhadpe2606@gmail.com,work.marathemayuresh@gmail.com,s47311906@gmail.com`)
5. Click **Deploy -> New Deployment**. Select **Web App** as type.
   - **Execute as**: `Me` (your Google Account: `7bit.media.co@gmail.com`)
   - **Who has access**: `Anyone`
6. Deploy and copy the Web App URL into `server/.env` under `GOOGLE_SHEETS_WEBHOOK_URL`.
