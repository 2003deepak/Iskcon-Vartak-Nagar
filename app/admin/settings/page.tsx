"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
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
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      } else {
        setMessage({ type: "success", text: "Your password has been securely updated." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Admin Settings &amp; Security
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage authentication parameters, credentials, and token configurations.
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <span>🔑</span> Update Password
          </h2>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2.5 ${message.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                  : "bg-red-950/40 border border-red-800 text-red-300"
                }`}
            >
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs transition duration-200 disabled:opacity-60"
            >
              {isLoading ? "Updating Password..." : "Save New Password"}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
