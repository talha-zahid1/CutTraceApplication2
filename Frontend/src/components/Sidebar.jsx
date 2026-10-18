import React, { useState } from "react";
import { NAV_SECTIONS } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";
import logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile-only hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Mobile overlay backdrop with blur */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar: mobile pe full-height edge-to-edge drawer, desktop pe static */}
      <div
        className={`w-[240px] lg:w-[290px] shrink-0 border-r border-gray-200 shadow-2xl bg-[#EEF1FB] flex flex-col
        h-full lg:h-auto lg:min-h-screen
        fixed lg:static top-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 px-5 border-b border-gray-200/70 flex items-center justify-between gap-6 shrink-0">
  <img src={logo} alt="CutTrace" className="h-9 w-auto object-contain shrink-0" />
  <button
    onClick={() => setIsOpen(false)}
    className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-slate-200/60 transition-colors shrink-0"
  >
    <X size={18} />
  </button>
</div>

        <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {NAV_SECTIONS.map((group, i) => (
            <div key={i}>
              {group.section && (
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.section}
                </p>
              )}
              <div className="space-y-1 -mx-2">
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
      </div>
    </>
  );
}