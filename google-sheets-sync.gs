// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const FIREBASE_PROJECT_ID = "aeronitk-698ac";
const CLIENT_EMAIL        = "firebase-adminsdk-fbsvc@aeronitk-698ac.iam.gserviceaccount.com";
const RAW_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjN5kuTem7nbZb\n/gkZ8E4F1/7OZF4SAzT+47SQTPu+VZlZlKfezLs1BMYlsPP1in+fW+McPN5rsISY\nap2/9a0lYx4YVE/pTOuFWwnWFAbj/vIoIcGM7zrrkh+QuDrprCcnmO9FTQeurx9M\n9a7ThxYJsZHiX7Q5NrRra+Zv8j9bLRFFO62dAqqbwLhGNXlTBslzhBisfb09SNLL\ntL3wiLvrJr/zMgvoO2M3DpeBK4eVDBXx1aTEzO1BQOzvWysdJP0S4KYm6mUtjGc2\nKx+v26A68D+9r3QLN3fATXH2uM/RwExNISd8S69Fgq6YDYUOoWAyl17jRSDNIwcO\nhj3p84mHAgMBAAECggEABx0uw4po1CEhKCxP6D4FoJKUDBnq0b0rC6sQHTQFyvt/\nJhzpHjhtNnfhTRZD4+FoA6GlKf9rMGVuuhf3jTzfkaAa2TOfkgskvtjDen2/+SMN\nGfuyrHpm5oqlbpDhHHtA76RmVW5wlcgTRK72skiSiNShB61lNRMx1PbMgfeclFQ2\nOTXeSd8b+mLGKeQHI6QbBB+PnQHSfrKxZx0XLZBEGU85AbQuWgEnJP0sRmuSISbu\no+piu+LESkJAt8PM6vhoCMorWGQo7LaiPhfy+zqyOmbEOwBA9KZ5d8PPiqf21Txb\nncfWAP2lEUltHWV/E7AiT5TjNk5Lk7iPbqoHHNSIxQKBgQDNoAEavWZmZBkPHb2a\nSBd8BU62qrGxzYvFbrqmODnm61HKXtrSy286iccZM8LwNVYk4kxXh/wiBHE073oY\niCgKUdPlb4L0+H5lnyWU116vbrnaP/yxi6tbSVHGiFXZxDJ8YAc7nMJbncS1AFMt\nlttB4oEF/Fh9KhWLCJrQp02ENQKBgQDLM/DRAOnYoPsXvA401sD/43g34SLi7SUj\nEY/pU+TAg63bSFN0PsNc3i71ZjPM8l5bRjPKaaAowP9PJHFMxBlm+VAik4K+gHcA\nC8eQNPXMFulPsHgyZcmrbqsS2xhl7QE2ICTrTmIc28/c7hyc0T2ggvlItVGm0SZi\nmH86/wRWSwKBgEYsmvPjO3UqKBsujSx/+fPLY+eXLXl+qnrApVZgzfHu0UT9RjS2\nVMlnh9kj/x03NqTzzhX5RKTfWzszlzmUDgYnkuc0PT8ZJxnLTGoVbiz03tyLBdQZ\n1GsdBJl6ocHl4UztAMrpXrMhjqYu7DQczcsYX+wJCLH+kMeYMi2PSzcZAoGANOYn\nqfFH70oxM8OUGzNQ+QyZjkqAz3yW72MyCLb7VRaymuRgPWHdb/6zUNUzZQYvhClp\ncCdBN3rOvCarjCV8y27Z6rZmEfvVfuCSKjtvRZstT76L++q9rnBX/sekuVwStal2\nkv9L0WFz4nrmXfimx3NxO/lf8UJ/cKlsbcpXsbMCgYEAsYm1Ze8YItaMM8AuOLyc\npGMwbz5tRjbgNPA16/VUxunHagMtzy7u46EuHdPsSZnr7fMm4l/3ay38u6YkgdJr\n9XTuOhK/O+3t/hVqE6jXkC4d9KSFy5FoZ+icC1wWEYDMglUuQnZ2qd7gQpY1xh4R\nsmYMk8Y57zCB0EYCtktIz54=\n-----END PRIVATE KEY-----\n";
const PRIVATE_KEY         = RAW_KEY.replace(/\\n/g, '\n');
const COLLECTION_NAME     = "workshop_registrations";

// Column order — MUST match HEADERS below (1-indexed)
const HEADERS = [
  "Name",
  "Email",
  "Roll No",
  "Phone",
  "Branch",
  "Year",
  "Has Team?",
  "Team Name",
  "Expectations",
  "Submitted At"
];
const NUM_COLS = HEADERS.length; // 10
// ──────────────────────────────────────────────────────────────────────────────


/**
 * Main sync function — call this manually or via a time-based trigger.
 * Fetches ALL documents from the Firestore collection (handles pagination)
 * and writes them to the active sheet, refreshing from row 2 downward.
 */
function syncWorkshopData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Always (re-)write the header row so columns are labelled correctly
  setupHeaders(sheet);

  try {
    const token = getServiceAccountToken();
    const docs   = fetchAllDocuments(token);

    // Clear previous data rows (keep header)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, NUM_COLS).clearContent();
    }

    if (docs.length === 0) {
      SpreadsheetApp.getUi().alert("No registrations found in Firestore.");
      return;
    }

    const rows = docs.map(doc => {
      const f = doc.fields || {};

      // Firestore stores booleans as booleanValue and strings as stringValue
      const str  = (key) => f[key]?.stringValue  || "";
      const bool = (key) => f[key]?.booleanValue != null
                              ? (f[key].booleanValue ? "Yes" : "No")
                              : str(key); // fall back to string ("yes"/"no") if stored as string

      // Parse Firestore timestamp → readable date
      let submittedAt = "";
      if (f.submittedAt?.timestampValue) {
        submittedAt = new Date(f.submittedAt.timestampValue).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata"
        });
      }

      return [
        str("name"),
        str("email"),
        str("rollNo"),
        str("phone"),
        str("branch"),
        str("year") === "1" ? "1st Year" : str("year"), // normalise
        bool("hasTeam"),   // "yes" / "no" / ""
        str("teamName"),
        str("expectations"),
        submittedAt
      ];
    });

    sheet.getRange(2, 1, rows.length, NUM_COLS).setValues(rows);

    // Auto-resize all data columns for readability
    sheet.autoResizeColumns(1, NUM_COLS);

    SpreadsheetApp.getUi().alert(`✅ Synced ${rows.length} registration(s) successfully.`);
  } catch (e) {
    console.error("Sync error: " + e.toString());
    SpreadsheetApp.getUi().alert("❌ Sync failed:\n" + e.toString());
  }
}


/**
 * Fetches all documents from the collection, following nextPageToken pagination
 * so you never miss entries when the collection grows beyond 300 docs.
 */
function fetchAllDocuments(token) {
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${COLLECTION_NAME}`;
  let allDocs   = [];
  let pageToken = null;

  do {
    const url      = pageToken ? `${baseUrl}?pageToken=${pageToken}` : baseUrl;
    const response = UrlFetchApp.fetch(url, {
      method: "get",
      headers: { "Authorization": "Bearer " + token },
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (result.documents) {
      allDocs = allDocs.concat(result.documents);
    }

    pageToken = result.nextPageToken || null;
  } while (pageToken);

  return allDocs;
}


/**
 * Writes the header row and applies formatting (bold, freeze, background).
 */
function setupHeaders(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, NUM_COLS);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1a73e8");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}


/**
 * Generates a short-lived OAuth 2.0 access token using the service account's
 * private key via a signed JWT (RS256).
 *
 * NOTE: The 'aud' must be the Google OAuth token endpoint, NOT the Firestore URL.
 */
function getServiceAccountToken() {
  const jwtHeader  = Utilities.base64EncodeWebSafe(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now        = Math.floor(Date.now() / 1000);
  const jwtPayload = Utilities.base64EncodeWebSafe(JSON.stringify({
    iss:   CLIENT_EMAIL,
    sub:   CLIENT_EMAIL,
    aud:   "https://oauth2.googleapis.com/token",   // ← correct token endpoint
    iat:   now,
    exp:   now + 3600,
    scope: "https://www.googleapis.com/auth/datastore"
  }));

  const toSign   = jwtHeader + "." + jwtPayload;
  const sigBytes = Utilities.computeRsaSha256Signature(toSign, PRIVATE_KEY);
  const jwt      = toSign + "." + Utilities.base64EncodeWebSafe(sigBytes);

  // Exchange the JWT for a real access token
  const tokenResponse = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
    method:  "post",
    payload: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt
    },
    muteHttpExceptions: true
  });

  const tokenResult = JSON.parse(tokenResponse.getContentText());
  if (tokenResult.error) {
    throw new Error("Token error: " + tokenResult.error_description);
  }
  return tokenResult.access_token;
}


/**
 * Adds a custom "Aero NITK" menu to the spreadsheet toolbar.
 * Runs automatically when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🛩️ Aero NITK")
    .addItem("Sync Workshop Registrations", "syncWorkshopData")
    .addToUi();
}
