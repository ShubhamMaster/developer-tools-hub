import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    const { error } = this.state;
    if (error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  handleReset = () => {
    this.setState({ error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.handleReset);
      }
      if (fallback) {
        return fallback;
      }

      const message = error?.message ? String(error.message) : 'Unexpected error.';
      return (
        <div className="ui-card p-6 text-sm">
          <p className="text-red-700 font-semibold">Something went wrong.</p>
          <p className="ui-muted mt-2">{message}</p>
          <button type="button" className="ui-btn mt-4" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}
