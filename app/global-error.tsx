"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Global error:", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-red-100 text-red-600 border border-red-200">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Critical Application Error</h1>
            <p className="text-sm text-slate-600">
              The application encountered an unexpected error. Please refresh the page to restore your session.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium inline-flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
