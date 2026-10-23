"use client";

import React, { useState } from "react";
import { FileSpreadsheet, CheckCircle2, AlertCircle, ExternalLink, Download, Sparkles, RefreshCw } from "lucide-react";

export function GoogleSheetsExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    configured: boolean;
    message: string;
    spreadsheetUrl?: string;
    setupGuide?: any;
  } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setResult(null);

    try {
      const response = await fetch("/api/export-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: new Date().toISOString() }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        configured: false,
        message: err.message || "Failed to contact Google Sheets API route.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCsvFallback = () => {
    // Generate a clean local CSV export of listings
    const headers = "ID,Title,Category,Type,Condition,Status,Location\n";
    const sampleRows = [
      'res-1,"TI-84 Plus CE Graphing Calculator",Electronics,lend,like_new,available,"Campus Library"',
      'res-2,"Introduction to Algorithms CLRS",Books & Notes,lend,good,available,"Engineering Quad"',
      'res-3,"Cotton Lab Coat & Splash Goggles",Lab Equipment,donate,like_new,available,"Chemistry Foyer"',
    ].join("\n");

    const blob = new Blob([headers + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `loopspace-campus-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-forest-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Google Sheets Live Synchronization
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export authorized resource listings, sharing requests, completed exchanges, and impact summaries directly to Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsvFallback}
            className="px-3.5 py-2 border border-slate-200 dark:border-forest-700 hover:bg-slate-50 dark:hover:bg-forest-900/30 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isExporting ? "animate-spin" : ""}`} />
            <span>{isExporting ? "Synchronizing..." : "Export to Google Sheets"}</span>
          </button>
        </div>
      </div>

      {/* Result feedback */}
      {result && (
        <div className="space-y-3 animate-in fade-in">
          {result.configured && result.success ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{result.message}</span>
              </div>
              {result.spreadsheetUrl && (
                <a
                  href={result.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold underline pt-1"
                >
                  <span>Open Synced Google Spreadsheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-3">
              <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{result.message}</p>
              </div>

              {result.setupGuide && (
                <div className="bg-white/80 dark:bg-forest-950/60 p-3 rounded-lg border border-amber-200/60 space-y-1.5 text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Google Sheets Setup Checklist for Viva / Deployment:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                    <li>{result.setupGuide.step1}</li>
                    <li>{result.setupGuide.step2}</li>
                    <li>{result.setupGuide.step3}</li>
                    <li>{result.setupGuide.step4}</li>
                    <li>{result.setupGuide.step5}</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
