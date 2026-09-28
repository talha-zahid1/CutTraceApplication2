import React from "react";
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  ClipboardList,
  Factory,
  FlaskConical,
  AlertTriangle,
  PackageCheck,
  Truck,
  Ruler,
  BarChart3,
  ShieldAlert,
  ReceiptText,
} from "lucide-react";

// Maps the icon name string used in sidebarConfig.js to the
// actual lucide-react component. Add new icons here when you
// add new nav items.
const ICON_MAP = {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  ClipboardList,
  Factory,
  FlaskConical,
  AlertTriangle,
  PackageCheck,
  Truck,
  Ruler,
  BarChart3,
  ShieldAlert,
  ReceiptText,
};

export default function SidebarItem({ item, active, onClick }) {
  const Icon = ICON_MAP[item.icon];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      {Icon && <Icon size={18} strokeWidth={2} className="shrink-0" />}
      <span className="truncate">{item.label}</span>
    </button>
  );
}
