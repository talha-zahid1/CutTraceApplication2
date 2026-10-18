import React, { useCallback, useEffect, useState } from "react";
import { api } from "../services/auth";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LockKeyhole,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const initialProfile = {
  full_name: "",
  email: "",
  phone: "",
  role: "Normal User",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Separate state for the INITIAL profile load — this is the one that
  // takes over the whole page (same pattern as the report pages), unlike
  // a save/update error which should just show a small banner.
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const getErrorMessage = (err, fallback) => {
    const body = err.response?.data;

    if (typeof body?.message === "string") return body.message;
    if (typeof body?.detail === "string") return body.detail;
    if (typeof body?.error === "string") return body.error;

    // Backend validation errors
    if (body && typeof body === "object") {
      const fieldErrors = Object.entries(body)
        .map(([field, value]) => {
          const message = Array.isArray(value)
            ? value
                .map((item) =>
                  typeof item === "string" ? item : JSON.stringify(item)
                )
                .join(", ")
            : typeof value === "string"
              ? value
              : "";

          return message ? `${field}: ${message}` : "";
        })
        .filter(Boolean);

      if (fieldErrors.length) {
        return fieldErrors.join(" | ");
      }
    }

    // Network and timeout errors
    if (err.message === "Network Error" || !err.response) {
      if (err.code === "ECONNABORTED") {
        return "The request timed out. Please try again.";
      }

      if (err.message === "Network Error") {
        return "Unable to connect to the server. Please check your connection.";
      }
    }

    return err.message || fallback;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const fetch_profile = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");

      const response = await api.get("/profile_api/");

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Couldn't load profile."
          )
        );
      }

      const data = response.data?.data;

      if (!data) {
        throw new Error("Invalid profile data received from the server.");
      }

      const profileData = {
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "Normal User",
      };

      setProfile(profileData);
      setFormData(profileData);
    } catch (err) {
      console.error(
        "Failed to fetch profile:",
        err.response?.data || err.message
      );

      setFetchError(getErrorMessage(err, "Couldn't load profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_profile();
  }, [fetch_profile]);

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setSaved(false);
    setError("");
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setSaved(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    setError("");
    setSaved(false);

    try {
      setSaving(true);

      const { role, ...editablePayload } = formData;

      const response = await api.patch("update_profile_api/", editablePayload);

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Couldn't update profile."
          )
        );
      }

      const updatedProfile = { ...formData, role: profile.role };
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      setSaved(true);
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err.response?.data || err.message
      );

      setError(getErrorMessage(err, "Couldn't update profile."));
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile.full_name.trim() || "Your Name";
  const displayEmail = profile.email.trim() || "No email added";

  const initials = profile.full_name.trim()
    ? profile.full_name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#EEF1FB]">
      
      <main className="mx-auto w-full max-w-6xl px-13 py-6 sm:py-8 sm:pl-10 sm:pr-7 lg:pl-22 lg:pr-6">
        {/* Page heading */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500 sm:mb-2 sm:gap-2 sm:text-sm">
              <UserRound size={14} className="sm:hidden" />
              <UserRound size={16} className="hidden sm:block" />
              <span>Account</span>
              <span>/</span>
              <span className="font-medium text-blue-600">My Profile</span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl lg:text-3xl">
              My Profile
            </h1>

            <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">
              View and manage your personal account information.
            </p>
          </div>

          {!loading && !fetchError && (
            !isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-5 sm:py-3 sm:text-sm"
              >
                <Pencil size={16} className="sm:hidden" />
                <Pencil size={17} className="hidden sm:block" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <X size={16} className="sm:hidden" />
                  <X size={17} className="hidden sm:block" />
                  Cancel
                </button>

                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <Save size={16} className="sm:hidden" />
                  <Save size={17} className="hidden sm:block" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )
          )}
        </div>

        {/* Initial load: loading state */}
        {loading && (
          <div className="flex min-h-[70vh] items-center justify-center px-4">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              Loading your profile...
            </p>
          </div>
        )}

        {/* Initial load: error state — takes over the whole page, same as the report pages */}
        {!loading && fetchError && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
            <AlertCircle size={26} className="text-red-500 sm:size-7" />
            <p className="text-sm font-medium text-red-500 sm:text-base">
              Unable to load profile
            </p>
            <p className="max-w-lg break-words text-xs text-slate-500 sm:text-sm">
              {fetchError}
            </p>
            <button
              type="button"
              onClick={fetch_profile}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
            >
              <RefreshCw size={14} className="sm:hidden" />
              <RefreshCw size={15} className="hidden sm:block" />
              Try Again
            </button>
          </div>
        )}

        {/* Loaded state: the actual profile UI */}
        {!loading && !fetchError && (
          <>
            {saved && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700 sm:mb-5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm">
                <CheckCircle2 size={17} className="shrink-0 sm:hidden" />
                <CheckCircle2 size={19} className="hidden shrink-0 sm:block" />
                Profile updated successfully.
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 sm:mb-5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0 sm:hidden" />
                <AlertCircle size={19} className="mt-0.5 hidden shrink-0 sm:block" />
                <p className="break-words">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
              {/* Profile overview */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
                <div className="h-24 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 sm:h-28" />

                <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                  <div className="-mt-10 flex items-end justify-between sm:-mt-12">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-xl font-bold text-blue-700 shadow-sm sm:h-24 sm:w-24 sm:text-2xl">
                      {initials}
                    </div>

                    <div className="mb-2 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:py-1.5 sm:text-xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Account
                    </div>
                  </div>

                  <h2 className="mt-3 break-words text-lg font-bold text-slate-800 sm:mt-4 sm:text-xl">
                    {displayName}
                  </h2>

                  <p className="mt-1 break-all text-xs text-slate-500 sm:text-sm">
                    {displayEmail}
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#EEF1FB] p-2.5 sm:mt-5 sm:p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 sm:h-10 sm:w-10">
                      <ShieldCheck size={19} className="sm:hidden" />
                      <ShieldCheck size={21} className="hidden sm:block" />
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-500 sm:text-xs">
                        Account Role
                      </p>
                      <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                        {profile.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">
                    <h3 className="mb-2.5 text-xs font-semibold text-slate-700 sm:mb-3 sm:text-sm">
                      Account Overview
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:h-9 sm:w-9">
                          <Mail size={15} className="sm:hidden" />
                          <Mail size={17} className="hidden sm:block" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500 sm:text-xs">
                            Email Address
                          </p>
                          <p className="break-all text-xs font-medium text-slate-700 sm:text-sm">
                            {displayEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:h-9 sm:w-9">
                          <Phone size={15} className="sm:hidden" />
                          <Phone size={17} className="hidden sm:block" />
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-500 sm:text-xs">
                            Phone Number
                          </p>
                          <p className="text-xs font-medium text-slate-700 sm:text-sm">
                            {profile.phone || "Not added"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:h-9 sm:w-9">
                          <CalendarDays size={15} className="sm:hidden" />
                          <CalendarDays size={17} className="hidden sm:block" />
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-500 sm:text-xs">
                            Account Type
                          </p>
                          <p className="text-xs font-medium text-slate-700 sm:text-sm">
                            CutTrace User
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Profile form */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2 lg:p-7">
                <div className="mb-5 border-b border-slate-100 pb-4 sm:mb-7 sm:pb-5">
                  <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {isEditing
                      ? "Update your details below."
                      : "Your account details are displayed below."}
                  </p>
                </div>

                <form id="profile-form" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {/* Full name */}
                    <div>
                      <label
                        htmlFor="full_name"
                        className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <UserRound
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden"
                        />
                        <UserRound
                          size={18}
                          className="absolute left-3.5 top-1/2 hidden -translate-y-1/2 text-slate-400 sm:block"
                        />

                        <input
                          id="full_name"
                          name="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={handleChange}
                          disabled={!isEditing || saving}
                          placeholder="Enter your full name"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80 sm:py-3 sm:pl-11 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                      >
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden"
                        />
                        <Mail
                          size={18}
                          className="absolute left-3.5 top-1/2 hidden -translate-y-1/2 text-slate-400 sm:block"
                        />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing || saving}
                          placeholder="Enter your email"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80 sm:py-3 sm:pl-11 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                      >
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden"
                        />
                        <Phone
                          size={18}
                          className="absolute left-3.5 top-1/2 hidden -translate-y-1/2 text-slate-400 sm:block"
                        />

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing || saving}
                          placeholder="Enter your phone number"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80 sm:py-3 sm:pl-11 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label
                        htmlFor="role"
                        className="mb-1.5 block text-xs font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                      >
                        Account Role
                      </label>

                      <div className="relative">
                        <ShieldCheck
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden"
                        />
                        <ShieldCheck
                          size={18}
                          className="absolute left-3.5 top-1/2 hidden -translate-y-1/2 text-slate-400 sm:block"
                        />

                        <input
                          id="role"
                          name="role"
                          type="text"
                          value={formData.role}
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-xs text-slate-500 sm:py-3 sm:pl-11 sm:text-sm"
                        />
                      </div>

                      <p className="mt-1.5 text-[11px] text-slate-400 sm:text-xs">
                        Your account role cannot be changed here.
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 sm:mt-7 sm:pt-5">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-3 sm:text-sm"
                      >
                        <Save size={16} className="sm:hidden" />
                        <Save size={17} className="hidden sm:block" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </section>

              {/* Security information */}
              {/* <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 lg:col-span-3 lg:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-12 sm:w-12">
                      <LockKeyhole size={20} className="sm:hidden" />
                      <LockKeyhole size={23} className="hidden sm:block" />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                        Account Security
                      </h2>

                      <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                        Keep your account details up to date. Password changes
                        and other security actions can be connected to your
                        authentication APIs later.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    title="Connect the password update API to enable this feature"
                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-400 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <LockKeyhole size={15} className="sm:hidden" />
                    <LockKeyhole size={16} className="hidden sm:block" />
                    Change Password
                  </button>
                </div>
              </section> */}
            </div>
          </>
        )}
      </main>
    </div>
  );
}