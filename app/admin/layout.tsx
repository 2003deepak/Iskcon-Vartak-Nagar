"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  const [currentUser, setCurrentUser] = useState<AdminUserSession | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(!isAuthPage);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Fetch current session if on a dashboard page
  useEffect(() => {
    if (isAuthPage) return;

    let isMounted = true;

    async function loadAdminUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            setCurrentUser(data.user);
            setIsLoadingUser(false);
            return;
          }
        }

        // If 401, attempt silent token refresh
        const refreshRes = await fetch("/api/admin/auth/refresh", {
          method: "POST",
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && isMounted) {
            setCurrentUser(refreshData.user);
            setIsLoadingUser(false);
            return;
          }
        }

        // If refresh fails, redirect to login
        if (isMounted) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch {
        if (isMounted) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    }

    loadAdminUser();

    return () => {
      isMounted = false;
    };
  }, [pathname, isAuthPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      setCurrentUser(null);
      router.push("/admin/login");
      router.refresh();
    }
  };

  // If on public auth page (login / forgot / reset), render directly without dashboard chrome
  if (isAuthPage) {
    return <>{children}</>;
  }

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      exact: true,
    },
    {
      name: "Vaishnava Calendar",
      href: "/admin/calendar",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Upcoming Events",
      href: "/admin/events",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: "Media & Images",
      href: "/admin/media",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Admin Settings",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen bg-[#090d16] text-slate-100 flex overflow-hidden antialiased selection:bg-amber-500 selection:text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 h-screen shrink-0 bg-[#0c1322] border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Top Brand Section & Navigation */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 shrink-0">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-amber-950/40">
                <Image src="/logo_white.png" alt="Logo" width={120} height={120} />
              </div>
              <div>
                <div className="font-serif text-base font-semibold text-white tracking-wide leading-tight">
                  ISKCON
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90">
                  Vartak Nagar Admin
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation List */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Management Modules
            </div>

            {navLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${isActive
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                >
                  <span className={isActive ? "text-amber-400" : "text-slate-400"}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Admin User Profile Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-slate-200 truncate">
                  {currentUser?.name || "Administrator"}
                </div>
                <div className="text-[10px] text-amber-400/80 capitalize truncate">
                  {currentUser?.role || "Authorized Admin"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Bar Header */}
        <header className="h-20 bg-[#0c1322]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h2 className="text-base font-medium text-slate-100 hidden sm:block">
                Temple Administration Portal
              </h2>

            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Public Website Preview Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition"
            >
              <span>View Public Site</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="hidden md:inline font-medium">{currentUser?.name || "Admin"}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/80 py-2 z-50 text-xs animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <div className="font-medium text-slate-100">{currentUser?.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Admin Profile & Security
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-950/30 transition"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoadingUser ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3 text-slate-400 text-xs">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Verifying administrator credentials...</span>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
