import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <span className="error-emoji">😅</span>
            <h2>Oops! Something went wrong</h2>
            <p>Don't worry - your progress is safe!</p>
            
            <div className="error-actions">
              <button className="primary-btn" onClick={this.handleReload}>
                🔄 Reload Page
              </button>
              <button className="secondary-btn" onClick={this.handleReset}>
                🧹 Clear Data & Reload
              </button>
            </div>

            <details className="error-details">
              <summary>Technical Details (for grown-ups)</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
