
export const NAV_SECTIONS = [
  {
    section: null,
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    section: "Production",
    items: [
      { label: "Fabric In", path: "/fabricin", icon: "PackagePlus" },
      { label: "Production Batches", path: "/productionbatches", icon: "Boxes" },
      { label: "Ready to Manufacture", path: "/ready-to-manufacture", icon: "ClipboardList" },
      { label: "Manufacturing", path: "/manufacturing", icon: "Factory" },
      { label: "Testing", path: "/testing", icon: "FlaskConical" },
      { label: "Suspicious Products", path: "/suspicious-products", icon: "AlertTriangle" },
      { label: "Ready to Deliver", path: "/ready-to-deliver", icon: "PackageCheck" },
      { label: "Delivered Products", path: "/delivered-products", icon: "Truck" },
      { label: "Standards", path: "/standards", icon: "Ruler" },
    ],
  },
  {
    section: "Reports",
    items: [
      { label: "Overall Production", path: "/reports/overall-production", icon: "BarChart3" },
      { label: "Suspicious Products", path: "/reports/suspicious-products", icon: "ShieldAlert" },
      { label: "Delivered Products", path: "/reports/delivered-products", icon: "ReceiptText" },
    ],
  },
  
];
