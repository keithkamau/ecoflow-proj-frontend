import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Tag,
  ArrowLeftRight,
  Leaf,
  Search,
  Package,
  Truck,
  BarChart2,
  Users,
  AlertTriangle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Recycle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS, ROLES } from "../../utils/constants";

const ICON_MAP = {
  LayoutDashboard,
  List,
  PlusCircle,
  Tag,
  ArrowLeftRight,
  Leaf,
  Search,
  Package,
  Truck,
  BarChart2,
  Users,
  AlertTriangle,
  MapPin,
};

const C = {
  primary: "var(--color-primary)",
  primaryLight: "var(--color-primary-light)",
  secondary: "var(--color-secondary)",
  neutral50: "var(--color-neutral-50)",
  neutral100: "var(--color-neutral-100)",
  neutral200: "var(--color-neutral-200)",
  neutral400: "var(--color-neutral-400)",
  neutral500: "var(--color-neutral-500)",
  neutral700: "var(--color-neutral-700)",
  neutral900: "var(--color-neutral-900)",
  errorLight: "var(--color-error-light)",
  errorDark: "var(--color-error-dark)",
  infoLight: "var(--color-info-light)",
  infoDark: "var(--color-info-dark)",
  white: "#ffffff",
};

/* ── Single nav item ─────────────────────────────────────────── */
function SidebarItem({ item, active, collapsed }) {
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
  const [hovered, setHovered] = useState(false);
  const highlighted = active || hovered;

  return (
    <li style={{ position: "relative", listStyle: "none" }}>
      <Link
        to={item.path}
        title={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 12,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "10px 0" : "10px 12px",
          borderRadius: 6,
          background: highlighted ? C.primaryLight : "transparent",
          color: highlighted ? C.primary : C.neutral500,
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: active ? 600 : 500,
          transition: "all 150ms",
          position: "relative",
        }}
      >
        {/* Active bar */}
        {active && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 24,
              background: C.primary,
              borderRadius: "0 4px 4px 0",
            }}
          />
        )}
        <Icon
          size={18}
          style={{
            flexShrink: 0,
            color: highlighted ? C.primary : C.neutral400,
          }}
        />
        {!collapsed && (
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.label}
          </span>
        )}

        {/* Tooltip when collapsed */}
        {collapsed && hovered && (
          <span
            style={{
              position: "absolute",
              left: "calc(100% + 12px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: C.neutral900,
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 500,
              padding: "6px 10px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-md)",
              zIndex: 100,
              pointerEvents: "none",
            }}
          >
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );
}

/* ── Section label ───────────────────────────────────────────── */
function SectionLabel({ label, collapsed }) {
  if (collapsed)
    return (
      <div
        style={{ borderTop: `1px solid ${C.neutral200}`, margin: "8px 12px" }}
      />
    );
  return (
    <div
      style={{
        padding: "16px 12px 4px",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: C.neutral400,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </div>
  );
}

/* ── Impact summary card ─────────────────────────────────────── */
function ImpactCard() {
  return (
    <div
      style={{
        margin: "0 12px 12px",
        padding: 12,
        background: C.primaryLight,
        borderRadius: 8,
        border: `1px solid rgba(16,185,129,0.2)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <Recycle size={13} color={C.primary} />
        <span
          style={{ fontSize: "0.75rem", fontWeight: 600, color: C.primary }}
        >
          Your Impact
        </span>
      </div>
      {[
        ["Recycled", "0 kg"],
        ["CO₂ Saved", "0 kg"],
      ].map(([label, val]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: "0.75rem", color: C.neutral500 }}>
            {label}
          </span>
          <span
            style={{ fontSize: "0.75rem", fontWeight: 600, color: C.primary }}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Sidebar ────────────────────────────────────────────── */
export default function Sidebar({ open }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user?.role ? (NAV_ITEMS[user.role] ?? []) : [];
  const isActive = (p) =>
    p === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(p);
  const main = navItems.slice(0, 4);
  const secondary = navItems.slice(4);

  const roleBg =
    user?.role === ROLES.ADMIN
      ? C.errorLight
      : user?.role === ROLES.RECYCLER
        ? C.infoLight
        : C.primaryLight;
  const roleText =
    user?.role === ROLES.ADMIN
      ? C.errorDark
      : user?.role === ROLES.RECYCLER
        ? C.infoDark
        : C.primary;

  if (!open) return null;

  const W = collapsed ? 72 : 240;

  return (
    <>
      <aside
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          bottom: 0,
          zIndex: 30,
          width: W,
          background: C.white,
          borderRight: `1px solid ${C.neutral200}`,
          display: "flex",
          flexDirection: "column",
          transition: "width 300ms ease",
          overflowX: "hidden",
        }}
        aria-label='Sidebar navigation'
        className='hide-on-mobile'
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            position: "absolute",
            right: -12,
            top: 20,
            zIndex: 10,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: C.white,
            border: `1px solid ${C.neutral200}`,
            boxShadow: "var(--shadow-sm)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.neutral400,
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Nav */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "12px 8px",
          }}
          className='no-scrollbar'
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <SectionLabel label='Main' collapsed={collapsed} />
              {main.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  active={isActive(item.path)}
                  collapsed={collapsed}
                />
              ))}
              {secondary.length > 0 && (
                <>
                  <SectionLabel
                    label={
                      user?.role === ROLES.ADMIN ? "Management" : "Insights"
                    }
                    collapsed={collapsed}
                  />
                  {secondary.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      active={isActive(item.path)}
                      collapsed={collapsed}
                    />
                  ))}
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${C.neutral100}`, paddingTop: 12 }}>
          {!collapsed &&
            (user?.role === ROLES.SELLER || user?.role === ROLES.RECYCLER) && (
              <ImpactCard />
            )}
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px 12px",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 9999,
                  background: roleBg,
                  color: roleText,
                  textTransform: "capitalize",
                }}
              >
                {user?.role}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: C.neutral400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </span>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) { .hide-on-mobile { display:none !important; } }
      `}</style>
    </>
  );
}
