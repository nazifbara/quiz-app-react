import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2 style={{ color: 'red', textAlign: 'center' }}>
          Something went wrong. Please refresh the page and try again.
        </h2>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
