"use client";

import { ErrorBoundary } from "./ErrorBoundary";

export default function ErrorBoundaryWrapper({ children }) {
  return <ErrorBoundary>{children?.props ? children : children}</ErrorBoundary>;
}
