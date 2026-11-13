# Activate Datespot's live slots tracker

The website and Google Apps Script are **separate deployments**. GitHub Pages deploys the React app from `main`, but publishing `google-apps-script/Code.gs` in GitHub does not update the existing Apps Script Web App.

1. Open the Apps Script project that is serving the `SHEET_URL` in `src/app/slots.tsx`.
2. Replace its `Code.gs` contents with the version from this repository.
3. Run `authorizeScreenshotStorage` in the Apps Script editor, approving permissions if requested.
4. Go to **Deploy → Manage deployments → Edit** on the existing Web App, select **New version**, then **Deploy**. Keep the same `/exec` URL, **Execute as: Me**, and **Access: Anyone**.
5. Open the existing `/exec` URL with `?action=slots&callback=dsCheck`; the body should resemble `dsCheck({"slots":26});`.
6. Submit a *new valid signup* and upload one screenshot through the website. The same status URL should now show `25`. Retry or re-upload using the same phone: the count must stay `25`. A new phone decrements it to `24`.

The server stores the initial 26 in code and records live remaining slots in Script Properties (key `ds_remaining_slots_v1`) upon the first successful new upload. **Do not reset that property during future deployments**, or the count will be lost.

What counts: a screenshot successfully saved to private Google Drive and linked in the signup sheet. This is **not bank/UPI payment verification**. One phone number can consume at most one slot, even after repeated uploads. Counts are shared and loaded by the website every 30 seconds and whenever the tab gains focus. Until the Apps Script is redeployed, the frontend cannot confirm new receipts or show a trustworthy live count.
