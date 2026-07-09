"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/Button";
import Link from "next/link";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error for debugging (consider sending to error tracking service in production)
        if (process.env.NODE_ENV === 'development') {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="inline-block p-4 rounded-full bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
                            <p className="text-gray-400 mb-4">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                            {this.state.error && (
                                <details className="text-left bg-white/5 rounded-lg p-4 text-sm text-gray-400">
                                    <summary className="cursor-pointer text-white mb-2">Error Details</summary>
                                    <pre className="overflow-auto">{this.state.error.message}</pre>
                                </details>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleReset} className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Link 
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-full font-bold transition duration-200 cursor-pointer border-2 border-teal-500 text-teal-500 hover:bg-teal-500/10"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

