import { google } from "googleapis";
import { Resource, ResourceRequest, ImpactTransaction } from "@/types";

export interface GoogleSheetsConfig {
  clientEmail?: string;
  privateKey?: string;
  spreadsheetId?: string;
}

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  return {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Replace escaped newlines from environment variables
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  };
}

export function isGoogleSheetsConfigured(): boolean {
  const config = getGoogleSheetsConfig();
  return Boolean(
    config.clientEmail &&
    config.privateKey &&
    config.spreadsheetId &&
    !config.clientEmail.includes("example.com")
  );
}

/**
 * Server-side function to export authorized platform data to Google Sheets
 */
export async function exportDataToGoogleSheets(data: {
  resources: Resource[];
  requests: ResourceRequest[];
  impactTransactions: ImpactTransaction[];
}) {
  const config = getGoogleSheetsConfig();

  if (!isGoogleSheetsConfigured()) {
    throw new Error(
      "Google Sheets credentials are not configured. Please supply GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID in your environment variables."
    );
  }

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = config.spreadsheetId!;

  // 1. Prepare Tab 1: Resource Listings
  const resourceHeaders = [
    "ID",
    "Title",
    "Category",
    "Sharing Type",
    "Condition",
    "Quantity",
    "Pickup Location",
    "Status",
    "Available From",
    "Available Until",
    "Views",
    "Created At",
  ];
  const resourceRows = data.resources.map((r) => [
    r.id,
    r.title,
    r.category,
    r.sharing_type,
    r.condition,
    r.quantity,
    r.pickup_location,
    r.status,
    r.available_from || "Flexible",
    r.available_until || "Flexible",
    r.views_count,
    r.created_at,
  ]);

  // 2. Prepare Tab 2: Sharing Requests
  const requestHeaders = [
    "Request ID",
    "Resource Title",
    "Requester Name",
    "Owner Name",
    "Status",
    "Needed From",
    "Needed Until",
    "Pickup Notes",
    "Created At",
  ];
  const requestRows = data.requests.map((req) => [
    req.id,
    req.resource?.title || "N/A",
    req.requester?.full_name || req.requester_id,
    req.owner?.full_name || req.owner_id,
    req.status,
    req.needed_from || "Flexible",
    req.needed_until || "Flexible",
    req.pickup_notes || "",
    req.created_at,
  ]);

  // 3. Prepare Tab 3: Completed Exchanges
  const completedHeaders = [
    "Request ID",
    "Item Exchanged",
    "Requester",
    "Provider / Owner",
    "Completed Date",
  ];
  const completedRows = data.requests
    .filter((r) => r.status === "completed")
    .map((req) => [
      req.id,
      req.resource?.title || "N/A",
      req.requester?.full_name || req.requester_id,
      req.owner?.full_name || req.owner_id,
      req.updated_at,
    ]);

  // 4. Prepare Tab 4: Monthly Impact Summary
  const impactHeaders = [
    "Transaction ID",
    "User",
    "Activity Type",
    "Points Earned",
    "Estimated CO2 Saved (kg)",
    "Estimated Cost Saved ($)",
    "Timestamp",
  ];
  const impactRows = data.impactTransactions.map((tx) => [
    tx.id,
    tx.user_id,
    tx.activity_type,
    tx.points,
    tx.co2_saved_kg,
    tx.money_saved_estimate,
    tx.created_at,
  ]);

  // Write to Google Sheets using batchUpdate or individual append / update
  // Format sheet tabs and append data
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Resource Listings!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [resourceHeaders, ...resourceRows],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sharing Requests!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [requestHeaders, ...requestRows],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Completed Exchanges!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [completedHeaders, ...completedRows],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Monthly Impact Summary!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [impactHeaders, ...impactRows],
    },
  });

  return {
    success: true,
    rowsExported:
      resourceRows.length + requestRows.length + completedRows.length + impactRows.length,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
  };
}
