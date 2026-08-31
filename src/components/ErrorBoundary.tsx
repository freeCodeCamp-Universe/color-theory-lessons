import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  resetKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallback}>
          <h1 className={styles.message}>something went wrong.</h1>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => this.setState((s) => ({ hasError: false, resetKey: s.resetKey + 1 }))}
          >
            try again
          </button>
        </div>
      );
    }
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
