
import React, { useCallback, useEffect, useState } from "react";
import {api} from '../services/auth'
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
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// import { api } from "../services/auth";

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

  const getErrorMessage = (err, fallback) => {
  const body = err.response?.data;

  if (typeof body?.message === "string") return body.message;
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.error === "string") return body.error;
  if (body?.error) return JSON.stringify(body.error);

  return err.message || fallback;
};

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const fetch_profile = useCallback(async () => {
  try {
    setError("");

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
    console.error("Failed to fetch profile:", err.response?.data || err.message);
    setError(getErrorMessage(err, "Couldn't load profile."));
  }
}, []);
  useEffect(() => {
    fetch_profile()
  }, [fetch_profile]);



  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setSaved(false);
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await api.patch("update_profile_api/", formData);

    if (response.data?.status === false) {
      throw new Error(
        getErrorMessage(
          { response: { data: response.data } },
          "Couldn't update profile."
        )
      );
    }

    setProfile(formData);
    setIsEditing(false);
    setSaved(true);
  } catch (err) {
    console.error("Failed to update profile:", err.response?.data || err.message);
    setError(getErrorMessage(err, "Couldn't update profile."));
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
    

      <main className="mx-auto w-full max-w-6xl py-8 pl-8 pr-5 sm:pl-10 sm:pr-7 lg:pl-22 lg:pr-6">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <UserRound size={16} />
              <span>Account</span>
              <span>/</span>
              <span className="font-medium text-blue-600">My Profile</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your personal account information.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                form="profile-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {saved && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={19} />
            Profile updated locally. Connect the API to save changes permanently.
          </div>
        )}
        {error && (
  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    <AlertCircle size={19} className="mt-0.5 shrink-0" />
    <p className="break-words">{error}</p>
  </div>
)}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile overview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
            <div className="h-28 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300" />

            <div className="px-6 pb-6">
              <div className="-mt-12 flex items-end justify-between">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
                  {initials}
                </div>

                <div className="mb-2 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Account
                </div>
              </div>

              <h2 className="mt-4 break-words text-xl font-bold text-slate-800">
                {displayName}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {displayEmail}
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#EEF1FB] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Account Role</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {profile.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  Account Overview
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Mail size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="break-all text-sm font-medium text-slate-700">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Phone size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="text-sm font-medium text-slate-700">
                        {profile.phone || "Not added"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <CalendarDays size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Account Type</p>
                      <p className="text-sm font-medium text-slate-700">
                        CutTrace User
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile form */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-bold text-slate-800">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update your details below."
                  : "Your account details are displayed below."}
              </p>
            </div>

            <form id="profile-form" onSubmit={handleSave}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-default disabled:opacity-80"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Account Role
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Your account role cannot be changed here.
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Security information */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <LockKeyhole size={23} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Account Security
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    Keep your account details up to date. Password changes and
                    other security actions can be connected to your
                    authentication APIs later.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled
                title="Connect the password update API to enable this feature"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400"
              >
                <LockKeyhole size={16} />
                Change Password
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
