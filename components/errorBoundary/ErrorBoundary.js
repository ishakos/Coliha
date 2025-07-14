import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! 😢</h1>
            <p className="text-gray-300 mb-6">
              Something went wrong while loading this page. Do not worry — it is
              not your fault.
            </p>
            <button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}
