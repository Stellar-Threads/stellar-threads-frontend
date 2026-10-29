'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    console.error('Uncaught error inside Stellar Threads Component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-rose-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
            <h3 className="text-lg font-semibold text-rose-100">
              {this.props.fallbackTitle || 'Component Render Error'}
            </h3>
          </div>
          <p className="text-sm text-rose-300/80 mb-4 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
