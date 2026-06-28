"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requiredRole = null,
  fallback = null,
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // 1. Still checking with the backend.
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      fallback ?? (
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-10">
            <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
            <p className="mt-2 text-sm text-red-600">
              You don&apos;t have permission to view this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return children;
}