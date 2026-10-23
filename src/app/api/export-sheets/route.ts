import { NextResponse } from "next/server";
import { exportDataToGoogleSheets, isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { getResources, getUserRequests, getImpactOverview } from "@/lib/data-service";

export async function POST(request: Request) {
  try {
    // In production, verify user authentication / admin status
    const body = await request.json().catch(() => ({}));
    const targetUserId = body.userId;

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          message:
            "Google Sheets credentials are not configured. To enable live exports, please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID in your environment variables.",
          setupGuide: {
            step1: "Create a project in Google Cloud Console and enable Google Sheets API.",
            step2: "Create a Service Account and download the JSON credentials.",
            step3: "Create a Google Spreadsheet with tabs: 'Resource Listings', 'Sharing Requests', 'Completed Exchanges', 'Monthly Impact Summary'.",
            step4: "Share the spreadsheet with Edit permissions with your service account email.",
            step5: "Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID in .env.local.",
          },
        },
        { status: 200 } // Return 200 with configured: false so the UI can explain the setup cleanly!
      );
    }

    const resources = await getResources();
    const requests = await getUserRequests(targetUserId || "admin");
    const impact = await getImpactOverview(targetUserId);

    const result = await exportDataToGoogleSheets({
      resources,
      requests: [...requests.sent, ...requests.received],
      impactTransactions: impact.transactions,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      message: `Successfully synchronized ${result.rowsExported} records to Google Sheets.`,
      spreadsheetUrl: result.spreadsheetUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to export data to Google Sheets.",
      },
      { status: 500 }
    );
  }
}
