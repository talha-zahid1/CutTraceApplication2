
import React, { useState, useRef, useEffect, useContext } from "react";
import { NAV_SECTIONS } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";
import logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { api, setapiaccesstoken } from "../services/auth";
import { model_context } from "../Context/ApiContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const errorTimer = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { setaccess_token } = useContext(model_context);

  useEffect(() => {
    return () => {
      clearTimeout(errorTimer.current);
    };
  }, []);

  const showLogoutError = (message) => {
    clearTimeout(errorTimer.current);

    setLogoutError(message);

    errorTimer.current = setTimeout(() => {
      setLogoutError("");
      errorTimer.current = null;
    }, 5000);
  };

  const getErrorMessage = (err, fallback) => {
    const body = err.response?.data;

    if (typeof body?.message === "string") return body.message;
    if (typeof body?.detail === "string") return body.detail;
    if (typeof body?.error === "string") return body.error;

    if (body && typeof body === "object") {
      const messages = Object.entries(body)
        .map(([field, value]) => {
          const text = Array.isArray(value)
            ? value.join(", ")
            : typeof value === "string"
              ? value
              : "";

          return text ? `${field}: ${text}` : "";
        })
        .filter(Boolean);

      if (messages.length) return messages.join(" | ");
    }

    if (err.message === "Network Error") {
      return "Unable to connect to the server. Please check your connection.";
    }

    if (err.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    if (err.message && !err.response) {
      return err.message;
    }

    return fallback;
  };

  const handleClick = (path) => {
    navigate(path);
    setIsOpen(false);
    setLogoutError("");
    clearTimeout(errorTimer.current);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLogoutError("");
    clearTimeout(errorTimer.current);

    try {
      setLoggingOut(true);

      const refreshToken = localStorage.getItem("refresh_token");
      console.log("Refresh token exists:", !!refreshToken);
console.log(
  "Token type:",
  refreshToken ? JSON.parse(atob(refreshToken.split(".")[1])).token_type : "missing"
);
      if (!refreshToken) {
        throw new Error("Logout failed.");
      }

      const response = await api.post("/logout/", {
        refresh: refreshToken,
      });
      console.log(response)
      if (response.data?.status === false) {
        throw new Error(
          response.data?.message ||
            response.data?.detail ||
            "Logout failed. Please try again."
        );
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Clear Axios in-memory token
      setapiaccesstoken(null);

      // Clear React Context token
      setaccess_token("");

      setIsOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data || error.message
      );

      showLogoutError(
        getErrorMessage(error, "Logout failed. Please try again.")
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:bg-slate-50 lg:hidden"
      >
        <Menu size={20} className="text-slate-600" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh min-h-0 w-[250px] shrink-0 flex-col border-r border-slate-200/80 bg-[#EEF1FB] transition-transform duration-300 ease-in-out lg:w-[270px]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/70 px-5">
          <img
            src={logo}
            alt="CutTrace"
            className="h-9 w-auto object-contain"
          />

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="sidebar-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {NAV_SECTIONS.map((group, i) => (
            <div key={i}>
              {group.section && (
                <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.section}
                </p>
              )}

              <div className="-mx-2 space-y-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    active={location.pathname === item.path}
                    onClick={() => handleClick(item.path)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Account section */}
        <div className="shrink-0 border-t border-slate-200/80 px-5 py-4">
          <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          {logoutError && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p className="break-words">{logoutError}</p>
            </div>
          )}

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleClick("/profile")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname === "/profile"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-800"
              }`}
            >
              <UserRound size={18} />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={18} />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
