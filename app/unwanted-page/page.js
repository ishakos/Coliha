"use client";
import { Suspense } from "react";
import Unwanted from "@/components/errorBoundary/Unwanted";

export default function UnwantedPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <Unwanted />
    </Suspense>
  );
}
