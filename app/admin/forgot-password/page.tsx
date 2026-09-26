"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setErrorMessage(data.error || "Too many attempts. Please try again later.");
        setIsLoading(false);
        return;
      }

      // Always show generic confirmation state on success
      setSubmitted(true);
    } catch {
      setErrorMessage("Unable to connect to service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      {/* Sacred Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 mb-4 backdrop-blur-md">

            <Image src="/logo_white.png" alt="Logo" width={85} height={85} />

          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-white mb-1">
            Password Recovery
          </h1>
          <p className="text-xs uppercase tracking-widest font-medium text-amber-400/90">
            ISKCON Vartak Nagar Admin
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-8 shadow-2xl shadow-black/60 relative">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-slate-100 mb-2">
                Check Your Email
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                If an authorized account is associated with <strong>{email}</strong>, a secure password reset link has been dispatched.
              </p>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs mb-6 text-left">
                &bull; The reset link is single-use and will expire in <strong>1 hour</strong>.<br />
                &bull; If you do not see it within a few minutes, check your spam folder.
              </div>
              <Link
                href="/admin/login"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs transition duration-200"
              >
                &larr; Back to Admin Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-100 mb-1">
                  Forgot your password?
                </h2>
                <p className="text-xs text-slate-400">
                  Enter your registered administrator email address and we will send you a one-time password reset link.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@iskcon-tvn.org"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition duration-200"
                    />
                    <div className="absolute right-3 top-2.5 text-slate-500 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-900/30 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending Request...
                    </>
                  ) : (
                    "Send Password Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-400 hover:text-amber-400 transition"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
