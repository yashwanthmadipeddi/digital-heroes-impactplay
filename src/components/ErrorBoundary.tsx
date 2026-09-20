import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'The application encountered an unexpected error.'
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('ImpactPlay runtime error:', error, info);
  }

  handleReset = () => {
    localStorage.removeItem('impactplay-session');
    localStorage.removeItem('impactplay-demo-state');
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="runtime-error-page">
        <div className="runtime-error-card glass-card">
          <span className="eyebrow">IMPACTPLAY · RECOVERY</span>
          <h1>We hit a rendering issue.</h1>
          <p>
            The development build encountered a rendering error. Resetting the local demo session can clear stale demo data, but the underlying application error should also be fixed during development.
          </p>
          <code>{this.state.message}</code>
          <button className="btn btn-primary large" onClick={this.handleReset}>Reset demo session</button>
          <span className="runtime-error-help">For production, authenticated data is stored in Supabase instead of browser demo state.</span>
        </div>
      </main>
    );
  }
}
