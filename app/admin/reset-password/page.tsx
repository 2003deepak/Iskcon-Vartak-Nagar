"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Live password validation checklist
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Password reset token is missing from the URL. Please use the exact link sent to your email.");
      return;
    }

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setErrorMessage("Please ensure your password meets all complexity requirements listed below.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || "Failed to reset password. The link may have expired or was already used."
        );
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setErrorMessage("Network error. Could not complete password reset.");
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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/30 shadow-lg shadow-amber-950/40 mb-4 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-inner text-white font-bold text-xl">
              🛡️
            </div>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-white mb-1">
            Set New Password
          </h1>
          <p className="text-xs uppercase tracking-widest font-medium text-amber-400/90">
            ISKCON Vartak Nagar Admin
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-8 shadow-2xl shadow-black/60 relative">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-slate-100 mb-2">
                Password Successfully Reset
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Your administrator password has been safely updated and all previous sessions have been revoked.
              </p>
              <Link
                href="/admin/login"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-900/30 transition duration-200"
              >
                Sign In With New Password &rarr;
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-slate-100 mb-2">
                Missing Reset Token
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                The password reset link appears incomplete or invalid. Please request a new link from the forgot password page.
              </p>
              <Link
                href="/admin/forgot-password"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs transition duration-200"
              >
                Request New Password Reset Link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-100 mb-1">
                  Create a Strong Password
                </h2>
                <p className="text-xs text-slate-400">
                  Choose a robust password to safeguard temple administration access.
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition duration-200"
                  />
                </div>

                {/* Password Requirements Live Checklist */}
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                  <div className="font-medium text-slate-300 mb-1">Password Requirements:</div>
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : ""}`}>
                    <span>{hasMinLength ? "✓" : "○"}</span> Minimum 8 characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperCase && hasLowerCase ? "text-emerald-400" : ""}`}>
                    <span>{hasUpperCase && hasLowerCase ? "✓" : "○"}</span> Uppercase & lowercase letters
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : ""}`}>
                    <span>{hasNumber ? "✓" : "○"}</span> At least 1 number
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-400" : ""}`}>
                    <span>{hasSpecial ? "✓" : "○"}</span> At least 1 special character (@, #, $, !, etc.)
                  </div>
                  {confirmPassword && (
                    <div className={`flex items-center gap-1.5 ${isMatch ? "text-emerald-400" : "text-amber-400"}`}>
                      <span>{isMatch ? "✓" : "✕"}</span> Passwords match
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-900/30 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
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
                      Updating Password...
                    </>
                  ) : (
                    "Reset & Update Password"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-400 hover:text-amber-400 transition"
                >
                  &larr; Cancel and return to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-slate-400 text-sm">
          Loading reset portal...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
