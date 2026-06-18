export const COLORS = {
  primary: {
    light: "#D1FAE5",
    DEFAULT: "#10B981",
    dark: "#059669",
    darker: "#047857",
  },
  secondary: {
    light: "#FED7AA",
    DEFAULT: "#F97316",
    dark: "#EA580C",
    darker: "#DC2626",
  },
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    900: "#111827",
  },
  success: {
    light: "#D1FAE5",
    DEFAULT: "#10B981",
    dark: "#047857",
  },
  warning: {
    light: "#FED7AA",
    DEFAULT: "#F97316",
    dark: "#92400E",
  },
  error: {
    light: "#FEE2E2",
    DEFAULT: "#EF4444",
    dark: "#DC2626",
  },
  info: {
    light: "#DBEAFE",
    DEFAULT: "#3B82F6",
    dark: "#2563EB",
  },
  white: "#FFFFFF",
};

// ─── Typography ────────────────────────────────────────────────
export const FONT = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  size: {
    h1: "2rem", // 32px
    h2: "1.75rem", // 28px
    h3: "1.5rem", // 24px
    h4: "1.25rem", // 20px
    h5: "1.125rem", // 18px
    h6: "1rem", // 16px
    bodyLg: "1rem", // 16px
    body: "0.875rem", // 14px
    bodySm: "0.75rem", // 12px
    caption: "0.6875rem", // 11px
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// ─── Spacing (8px grid) ─────────────────────────────────────────
export const SPACING = {
  xs: "0.5rem", //  8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
  "2xl": "4rem", // 64px
  "3xl": "5rem", // 80px
};

// ─── Component Sizes ────────────────────────────────────────────
export const SIZES = {
  navbarHeight: "64px",
  navbarMobile: "56px",
  sidebarWidth: "240px",
  sidebarCollapsed: "72px",
  buttonSm: "32px",
  buttonMd: "40px",
  buttonLg: "48px",
  inputHeight: "40px",
  iconSm: "16px",
  iconMd: "24px",
  iconLg: "32px",
};

// ─── Border Radius ───────────────────────────────────────────────
export const RADIUS = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

// ─── Shadows ─────────────────────────────────────────────────────
export const SHADOW = {
  sm: "0 1px 3px rgba(0,0,0,0.10)",
  md: "0 4px 6px rgba(0,0,0,0.10)",
  lg: "0 10px 15px rgba(0,0,0,0.10)",
  cardHover: "0 4px 6px rgba(0,0,0,0.15)",
  focusGreen: "0 0 0 3px rgba(16,185,129,0.20)",
};

// ─── Transition Durations ────────────────────────────────────────
export const DURATION = {
  quick: 150,
  standard: 300,
  page: 500,
  slow: 700,
};

// ─── Navigation Items ─────────────────────────────────────────────
// Used by both Navbar and Sidebar — single source for routes
export const NAV_ITEMS = {
  seller: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Listings", path: "/listings/mine", icon: "List" },
    { label: "New Listing", path: "/listings/new", icon: "PlusCircle" },
    { label: "Offers", path: "/offers", icon: "Tag" },
    { label: "Nearby", path: "/nearby", icon: "MapPin" },
    { label: "Impact", path: "/analytics/impact", icon: "Leaf" },
  ],
  recycler: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Browse Waste", path: "/browse", icon: "Search" },
    { label: "Inventory", path: "/inventory", icon: "Package" },
    { label: "Pickups", path: "/pickups", icon: "Truck" },
    { label: "Transactions", path: "/transactions", icon: "ArrowLeftRight" },
    { label: "Nearby", path: "/nearby", icon: "MapPin" },
    { label: "Analytics", path: "/analytics", icon: "BarChart2" },
  ],
  admin: [
    { label: "Overview", path: "/admin", icon: "LayoutDashboard" },
    { label: "Users", path: "/admin/users", icon: "Users" },
    { label: "Listings", path: "/admin/listings", icon: "List" },
    {
      label: "Transactions",
      path: "/admin/transactions",
      icon: "ArrowLeftRight",
    },
    { label: "Disputes", path: "/admin/disputes", icon: "AlertTriangle" },
    { label: "Analytics", path: "/admin/analytics", icon: "BarChart2" },
  ],
};

// ─── User Roles ──────────────────────────────────────────────────
export const ROLES = {
  SELLER: "seller",
  RECYCLER: "recycler",
  ADMIN: "admin",
};

// ─── Transaction Statuses ────────────────────────────────────────
export const STATUS = {
  ACTIVE: { label: "Active", className: "badge-active" },
  PENDING: { label: "Pending", className: "badge-pending" },
  COMPLETED: { label: "Completed", className: "badge-completed" },
  CANCELLED: { label: "Cancelled", className: "badge-error" },
  EXPIRED: { label: "Expired", className: "badge-neutral" },
};

// ─── Material Types ──────────────────────────────────────────────
export const MATERIAL_TYPES = [
  { value: "plastic", label: "Plastic", color: COLORS.info.DEFAULT },
  { value: "metal", label: "Metal", color: COLORS.neutral[500] },
  { value: "glass", label: "Glass", color: COLORS.info.light },
  { value: "ewaste", label: "E-Waste", color: COLORS.secondary.DEFAULT },
  { value: "paper", label: "Paper", color: COLORS.warning.dark },
  { value: "organic", label: "Organic", color: COLORS.primary.DEFAULT },
  { value: "mixed", label: "Mixed", color: COLORS.neutral[400] },
];

// ─── API Base URL ─────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
