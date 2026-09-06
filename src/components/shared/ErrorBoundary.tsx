import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

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
    console.error("CryptoVision ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-[#0c0e14] border border-red-500/20 text-white my-8 shadow-2xl">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 mb-4 text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-bold font-mono mb-2">Component Temporary Pause</h3>
          <p className="text-xs font-sans text-white/60 max-w-md leading-relaxed mb-6">
            {this.state.error?.message || "An unexpected error occurred while rendering this module."}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload Module</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white font-mono text-xs hover:bg-white/20 transition-all cursor-pointer border border-white/15"
            >
              <Home className="h-3.5 w-3.5 text-cyan-400" />
              <span>Return Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorFallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 text-center bg-[#07090e] text-white">
      <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6 text-red-400">
        <AlertTriangle className="h-10 w-10" />
      </div>

      <h2 className="text-2xl font-bold font-mono mb-3">CryptoVision Institutional Error Boundary</h2>
      <p className="text-sm font-sans text-white/70 max-w-lg leading-relaxed mb-8">
        An unhandled routing exception or module loading error occurred. The terminal has safely isolated this page state.
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00dc82] text-black font-mono text-xs font-bold hover:bg-[#00dc82]/90 transition-all cursor-pointer shadow-lg shadow-[#00dc82]/20"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Terminal</span>
        </button>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-mono text-xs hover:bg-white/20 transition-all cursor-pointer border border-white/15"
        >
          <Home className="h-4 w-4 text-cyan-400" />
          <span>Return to Flagship</span>
        </a>
      </div>
    </div>
  );
}

