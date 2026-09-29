"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

interface AdminUserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export default function AdminSettingsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Live Password Validation Checks (consistent with reset/forgot password)
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = Boolean(newPassword && confirmNewPassword && newPassword === confirmNewPassword);

  const passedChecksCount = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPassword) return { label: "None", color: "bg-slate-700", text: "text-slate-400" };
    if (passedChecksCount <= 2) return { label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (passedChecksCount <= 4) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-400" };
    return { label: "Strong & Secure", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getStrengthLabel();

  // Load current admin info
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword.trim()) {
      setMessage({ type: "error", text: "Please provide your current password." });
      return;
    }

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setMessage({
        type: "error",
        text: "New password does not meet all complexity requirements. Please review the checklist below.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match. Please re-enter them carefully." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminFetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({
          type: "error",
          text: data.error || "Failed to update password. Please check your current password and try again.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Your password has been securely updated. All active security parameters are refreshed.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred while updating your password." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-[11px] font-semibold tracking-widest text-amber-300 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Security &amp; Credentials</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Admin Settings &amp; Security
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authentication parameters, credentials, active session security, and access controls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Session Active</span>
          </span>
        </div>
      </div>



      {/* Main Grid: Change Password Form & Security Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Change Password Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-sm font-bold">
                🔑
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Change Password
                </h2>
                <p className="text-xs text-slate-400">
                  Update your admin login credentials.
                </p>
              </div>
            </div>


          </div>

          {/* Feedback Messages */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs mb-6 flex items-start gap-3 shadow-lg ${message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-700/80 text-emerald-200"
                : "bg-rose-950/60 border border-rose-700/80 text-rose-200"
                }`}
            >
              <span className="text-base shrink-0">
                {message.type === "success" ? "✓" : "⚠️"}
              </span>
              <div className="flex-1 font-medium leading-relaxed">
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* Current Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Current Password <span className="text-amber-400">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition focus:outline-none cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  New Password <span className="text-amber-400">*</span>
                </label>
                {newPassword && (
                  <span className={`text-[11px] font-bold ${strength.text}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition focus:outline-none cursor-pointer"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Dynamic Strength Progress Bar */}
              {newPassword && (
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(passedChecksCount / 5) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Confirm New Password <span className="text-amber-400">*</span>
                </label>
                {confirmNewPassword && (
                  <span className={`text-[11px] font-bold ${isMatch ? "text-emerald-400" : "text-rose-400"}`}>
                    {isMatch ? "✓ Passwords Match" : "✕ Do Not Match"}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Live Password Requirements Checklist (Consistent with reset-password checks) */}
            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/90 text-xs space-y-2 text-slate-400">


              <div className={`flex items-center gap-2 transition-colors ${hasMinLength ? "text-emerald-400 font-medium" : "text-slate-400"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold" : "bg-slate-800 text-slate-500"}`}>
                  {hasMinLength ? "✓" : "○"}
                </span>
                <span>Minimum 8 characters</span>
              </div>

              <div className={`flex items-center gap-2 transition-colors ${hasUpperCase && hasLowerCase ? "text-emerald-400 font-medium" : "text-slate-400"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasUpperCase && hasLowerCase ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold" : "bg-slate-800 text-slate-500"}`}>
                  {hasUpperCase && hasLowerCase ? "✓" : "○"}
                </span>
                <span>Uppercase &amp; lowercase letters (A-Z, a-z)</span>
              </div>

              <div className={`flex items-center gap-2 transition-colors ${hasNumber ? "text-emerald-400 font-medium" : "text-slate-400"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold" : "bg-slate-800 text-slate-500"}`}>
                  {hasNumber ? "✓" : "○"}
                </span>
                <span>At least 1 numerical digit (0-9)</span>
              </div>

              <div className={`flex items-center gap-2 transition-colors ${hasSpecial ? "text-emerald-400 font-medium" : "text-slate-400"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold" : "bg-slate-800 text-slate-500"}`}>
                  {hasSpecial ? "✓" : "○"}
                </span>
                <span>At least 1 special character (@, #, $, !, %, etc.)</span>
              </div>

              {confirmNewPassword && (
                <div className={`flex items-center gap-2 pt-1 border-t border-slate-800/80 transition-colors ${isMatch ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isMatch ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold" : "bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold"}`}>
                    {isMatch ? "✓" : "✕"}
                  </span>
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Updating &amp; Encrypting...</span>
                </>
              ) : (
                <>
                  <span>Save &amp; Update Password</span>
                  <span className="material-symbols-outlined text-base">lock</span>
                </>
              )}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
