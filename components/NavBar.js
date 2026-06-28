"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          PostHub
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/posts"
            className="text-slate-600 transition-colors hover:text-indigo-600"
          >
            Posts
          </Link>
          <Link
            href="/admin"
            className="text-slate-600 transition-colors hover:text-indigo-600"
          >
            Admin
          </Link>

          {/* Avoid flashing "Login" for a split second while we're still
              asking the backend who's logged in. */}
          {loading ? null : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {user.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700
                           transition-colors hover:bg-slate-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white
                         transition-colors hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}