// This is the code for our external tracking service.

export default async function handler(request, response) {
  // --- CONFIGURATION ---
  // 1. Paste the URL of your Apps Script Web App here.
  //    Get it from Deploy > Manage deployments > Select your deployment > Copy the URL.
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrRJ7q48nqBFaMzRYX0x8HWPVzdfOVIBijdihfEZlJx7HbmH-YoD0oVW7pUO7X1aMVAA/exec';

  // 2. Paste the SECRET_KEY you created in your Code.js file.
  const SECRET_KEY = 'Talhaishere#12122234';
  // --------------------

  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId');

  if (!trackId) {
    // If there's no trackId, just return the pixel without doing anything.
    return respondWithPixel(response);
  }

  // Prepare the data to send back to our Google Sheet.
  const payload = {
    secret: SECRET_KEY,
    trackId: trackId,
  };

  try {
    // Make a secure, server-to-server POST request to our Apps Script.
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Log the error but don't prevent the pixel from returning.
    console.error('Error calling Apps Script:', error);
  }

  // Finally, always return the invisible pixel image.
  return respondWithPixel(response);
}

// Helper function to create the 1x1 GIF response.
function respondWithPixel(response) {
  const gifData = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const buffer = Buffer.from(gifData, 'base64');
  response.setHeader('Content-Type', 'image/gif');
  response.setHeader('Content-Length', buffer.length);
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.send(buffer);
}