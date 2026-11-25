# Appointment form backend (Google Apps Script)

The website form posts to a small Apps Script web app that saves each request to a Google Sheet and
emails the front desk a notice (with no patient details in it). It must run under the **practice's
Google Workspace**, not a personal account.

## 1. Before you start: HIPAA BAA

In the practice's Google Admin console (admin.google.com, signed in as a super admin):

1. Go to **Account → Account settings → Legal and compliance**.
2. Find **Google Workspace/Cloud Identity HIPAA Business Associate Amendment**, review it and accept it.

Only services on Google's HIPAA "included functionality" list are covered (Apps Script, Sheets, Drive
and Gmail are on it). Don't install third-party add-ons on the script or the sheet.

## 2. Create the script

1. Sign in to the practice account (the one that should own the data, e.g. a front-desk or admin mailbox).
2. Go to [script.google.com](https://script.google.com) → **New project**. Name it `Dr. Tooth website form`.
3. Replace the contents of `Code.gs` with [Code.gs](Code.gs) from this folder and save.
4. **Project settings (gear) → Script properties → Add**: `NOTIFY_EMAIL` = the mailbox that should get
   the "new request" notices (e.g. `Drtooth@drtooth.dental`).
5. In the editor, choose the function **`setup`** and click **Run**. Approve the permissions prompt. The log
   shows the URL of the new **Website appointment requests** sheet. Share it only with the staff who
   call patients back.
6. Choose **`testSubmission`** → **Run**. Check that a TEST row appears in the sheet and the notice email
   arrives. Delete the TEST row.

## 3. Deploy as a web app

1. **Deploy → New deployment → Select type: Web app.**
2. **Execute as:** Me. **Who has access:** Anyone.
   (If "Anyone" isn't offered, a Workspace admin must allow it: Admin console → Apps → Google Workspace
   → Drive and Docs → Sharing settings → allow sharing outside the organization.)
3. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
4. Open that URL in a browser. It should show `{"ok":true,"service":"drtooth-appointments"}`.
5. Paste the URL into `formEndpoint` in [src/data/site.ts](../src/data/site.ts) and push. The form only
   appears on the live site once this is set; until then it shows "Book by phone".

The URL isn't a secret; it's a public endpoint, protected by validation and rate limits in the script.

## Updating the script later

Edit the code, then **Deploy → Manage deployments → (pencil) → Version: New version → Deploy**. This
keeps the same URL. Creating a *new deployment* gives a new URL, which would need updating on the site.

## Retiring the old personal-account scripts

The old site posted to two scripts under a personal account (`AKfycbzV…` and the older `AKfycbwh…`).
After the new site is live and a real test request has arrived, open each old project at
script.google.com → **Deploy → Manage deployments → Archive**, then delete any old response sheets or
emails that contain patient data, according to the practice's record-keeping policy.
