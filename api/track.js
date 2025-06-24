// This is the FINAL, most robust version of the tracking service code.
// It reads the ID from the URL path (e.g., /api/track/some-uuid).

export default async function handler(request, response) {
  // --- THIS CONFIGURATION SHOULD ALREADY BE CORRECT ---
  const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'; // This should already be your correct URL
  const SECRET_KEY = 'PASTE_YOUR_SECRET_KEY_HERE'; // This should already be your secret key
  // ----------------------------------------------------

  // Get the full URL and extract the last part, which is our tracking ID.
  const trackId = request.url.split('/').pop();

  if (trackId && trackId !== 'track') { // Ensure we have an ID and it's not the word 'track'
    const payload = {
      secret: SECRET_KEY,
      trackId: trackId,
    };

    try {
      // Make the secure call back to our Apps Script.
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error calling Apps Script:', error);
    }
  }

  // Always return the invisible pixel image.
  const gifData = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const buffer = Buffer.from(gifData, 'base64');
  response.setHeader('Content-Type', 'image/gif');
  response.setHeader('Content-Length', buffer.length);
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.status(200).send(buffer);
}
