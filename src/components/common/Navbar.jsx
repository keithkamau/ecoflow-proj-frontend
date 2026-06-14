import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS, ROLES } from "../../utils/constants";

/* ── Inline style tokens (CSS vars from globals.css) ─────────── */
const C = {
  primary: "var(--color-primary)",
  primaryLight: "var(--color-primary-light)",
  secondary: "var(--color-secondary)",
  neutral500: "var(--color-neutral-500)",
  neutral700: "var(--color-neutral-700)",
  neutral900: "var(--color-neutral-900)",
  neutral100: "var(--color-neutral-100)",
  neutral200: "var(--color-neutral-200)",
  neutral50: "var(--color-neutral-50)",
  errorLight: "var(--color-error-light)",
  errorDark: "var(--color-error-dark)",
  error: "var(--color-error)",
  infoLight: "var(--color-info-light)",
  infoDark: "var(--color-info-dark)",
  white: "#ffffff",
};

/* ── SVG Logo ─────────────────────────────────────────────────── */
function EcoFlowLogo() {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='16' cy='16' r='15' stroke={C.primary} strokeWidth='2' />
      <path
        d='M16 5 C20 5, 24 9, 24 13 C24 17, 20 19, 16 19'
        stroke={C.primary}
        strokeWidth='2.2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M16 19 C12 19, 8 17, 8 13 C8 9, 12 7, 16 7'
        stroke={C.secondary}
        strokeWidth='2.2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M14 17 L16 19 L18 17'
        stroke={C.secondary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </svg>
  );
}

/* ── User avatar dropdown ─────────────────────────────────────── */
function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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

  const menuItem = (label, icon, onClick) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "10px 16px",
        fontSize: "0.875rem",
        color: C.neutral700,
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.neutral50;
        e.currentTarget.style.color = C.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = C.neutral700;
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: C.primary,
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {initials}
        </span>
        <span style={{ display: "none" }} className='md-show'>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: C.neutral700,
            }}
          >
            {user?.name}
          </span>
        </span>
        <ChevronDown
          size={14}
          color={C.neutral500}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms",
          }}
        />
      </button>

      {open && (
        <div
          className='animate-slide-down'
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 208,
            background: "#fff",
            border: `1px solid ${C.neutral200}`,
            borderRadius: 8,
            boxShadow: "var(--shadow-md)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${C.neutral100}`,
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: C.neutral900,
              }}
            >
              {user?.name}
            </p>
            <p style={{ fontSize: "0.75rem", color: C.neutral500 }}>
              {user?.phone ?? user?.email}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "2px 8px",
                background: roleBg,
                color: roleText,
                fontSize: "0.65rem",
                fontWeight: 700,
                borderRadius: 9999,
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </span>
          </div>
          {/* Items */}
          <div style={{ padding: "4px 0" }}>
            {menuItem("Profile", <User size={14} />, () => {
              navigate("/profile");
              setOpen(false);
            })}
            {menuItem("Settings", <Settings size={14} />, () => {
              navigate("/settings");
              setOpen(false);
            })}
          </div>
          {/* Logout */}
          <div
            style={{ borderTop: `1px solid ${C.neutral100}`, padding: "4px 0" }}
          >
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "10px 16px",
                fontSize: "0.875rem",
                color: C.error,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.errorLight)
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ──────────────────────────────────────────────── */
export default function Navbar({ onMenuToggle, sidebarOpen, notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role ? (NAV_ITEMS[user.role] ?? []) : [];
  const isActive = (p) =>
    p === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(p);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 500,
    color: active ? C.primary : C.neutral500,
    background: active ? C.primaryLight : "transparent",
    textDecoration: "none",
    transition: "all 150ms",
  });

  return (
    <>
      {/* Fixed bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          height: 64,
          background: "#fff",
          borderBottom: `1px solid ${C.neutral200}`,
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && (
            <button
              onClick={onMenuToggle}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "none",
                border: "none",
                color: C.neutral500,
                cursor: "pointer",
              }}
              aria-label='Toggle sidebar'
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link
            to='/'
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <EcoFlowLogo />
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              <span style={{ color: C.primary }}>Eco</span>
              <span style={{ color: C.secondary }}>Flow</span>
            </span>
          </Link>
        </div>

        {/* Center — desktop nav */}
        {user && (
          <nav
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            className='hide-mobile'
            aria-label='Main navigation'
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={linkStyle(isActive(item.path))}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.color = C.primary;
                    e.currentTarget.style.background = C.neutral50;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.color = C.neutral500;
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {user ? (
            <>
              {/* Bell */}
              <button
                style={{
                  position: "relative",
                  padding: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.neutral500,
                  borderRadius: 6,
                }}
                aria-label='Notifications'
              >
                <Bell size={20} />
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    background: C.secondary,
                    color: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              </button>
              <UserDropdown user={user} onLogout={handleLogout} />
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.neutral500,
                  borderRadius: 6,
                }}
                className='show-mobile'
                aria-label='Toggle mobile menu'
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='btn btn-tertiary btn-sm'>
                Sign in
              </Link>
              <Link to='/register' className='btn btn-primary  btn-sm'>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && user && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 30,
              background: "rgba(0,0,0,0.3)",
            }}
          />
          <div
            className='animate-slide-down'
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 40,
              background: "#fff",
              borderBottom: `1px solid ${C.neutral200}`,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <nav
              style={{
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={linkStyle(isActive(item.path))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderTop: `1px solid ${C.neutral100}`,
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: C.neutral900,
                }}
              >
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.875rem",
                  color: C.error,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={{ height: 64 }} aria-hidden='true' />

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px)  { .hide-mobile { display:none !important; } }
        @media (min-width: 769px)  { .show-mobile { display:none !important; } }
      `}</style>
    </>
  );
}
