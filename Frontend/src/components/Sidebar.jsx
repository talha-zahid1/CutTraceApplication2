
import React, { useState } from "react";
import { NAV_SECTIONS } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";
import logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import { api } from "../services/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };


const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");

    await api.post("/logout/", {
      refresh: refreshToken,
    });

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsOpen(false);
    navigate("/", { replace: true });
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data || error.message
    );
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

        {/* Account section pinned to bottom */}
        <div className="shrink-0 border-t border-slate-200/80 px-5 py-4">
          <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

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
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
