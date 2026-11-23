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
      <body className="min-h-screen bg-[#FAF9F6] text-[#161614] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold mb-2 text-[#161614]">Critical Application Error</h1>
            <p className="text-sm text-[#57554E]">
              The application encountered an unexpected error. Please refresh the page to restore your session.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
