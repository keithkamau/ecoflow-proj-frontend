import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Leaf,
  Bell,
} from "lucide-react";
import { NAV_ITEMS, ROLES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

// ─── EcoFlow SVG Logo Mark ─────────────────────────────────────
const EcoFlowLogo = ({ white = false }) => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='EcoFlow logo mark'
  >
    {/* Outer ring */}
    <circle
      cx='16'
      cy='16'
      r='15'
      stroke={white ? "#fff" : "#10B981"}
      strokeWidth='2'
    />
    {/* Flow arrow top */}
    <path
      d='M16 5 C20 5, 24 9, 24 13 C24 17, 20 19, 16 19'
      stroke={white ? "#fff" : "#10B981"}
      strokeWidth='2.2'
      strokeLinecap='round'
      fill='none'
    />
    {/* Flow arrow bottom */}
    <path
      d='M16 19 C12 19, 8 17, 8 13 C8 9, 12 7, 16 7'
      stroke={white ? "#F97316" : "#F97316"}
      strokeWidth='2.2'
      strokeLinecap='round'
      fill='none'
    />
    {/* Arrow head */}
    <path
      d='M14 17 L16 19 L18 17'
      stroke={white ? "#F97316" : "#F97316"}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </svg>
);

// ─── Notification Bell with badge ─────────────────────────────
const NotificationBell = ({ count = 0 }) => (
  <button
    className='relative p-2 rounded-md text-neutral-500 hover:text-primary hover:bg-primary-light transition-colors duration-150'
    aria-label={`${count} notifications`}
  >
    <Bell size={20} />
    {count > 0 && (
      <span className='absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full leading-none'>
        {count > 9 ? "9+" : count}
      </span>
    )}
  </button>
);

// ─── User Dropdown ─────────────────────────────────────────────
const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const roleBadgeClass =
    user?.role === ROLES.ADMIN
      ? "bg-error-light text-error-dark"
      : user?.role === ROLES.RECYCLER
        ? "bg-info-light text-info-dark"
        : "bg-primary-light text-primary-dark";

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors duration-150'
        aria-expanded={open}
        aria-haspopup='true'
      >
        {/* Avatar */}
        <span className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold'>
          {initials}
        </span>
        {/* Name + role — hidden on small screens */}
        <span className='hidden md:flex flex-col items-start leading-tight'>
          <span className='text-sm font-semibold text-neutral-700'>
            {user?.name ?? "User"}
          </span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${roleBadgeClass}`}
          >
            {user?.role ?? "member"}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className='absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-md z-50 animate-slide-down overflow-hidden'>
          {/* Header */}
          <div className='px-4 py-3 border-b border-neutral-100'>
            <p className='text-sm font-semibold text-neutral-900 truncate'>
              {user?.name}
            </p>
            <p className='text-xs text-neutral-400 truncate'>
              {user?.phone ?? user?.email}
            </p>
          </div>

          {/* Menu items */}
          <ul className='py-1'>
            <li>
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className='flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors duration-150'
              >
                <User size={15} /> Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/settings");
                  setOpen(false);
                }}
                className='flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors duration-150'
              >
                <Settings size={15} /> Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/analytics/impact");
                  setOpen(false);
                }}
                className='flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors duration-150'
              >
                <Leaf size={15} /> My Impact
              </button>
            </li>
          </ul>

          {/* Logout */}
          <div className='border-t border-neutral-100 py-1'>
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className='flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error-light transition-colors duration-150'
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Navbar ───────────────────────────────────────────────
const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role ? (NAV_ITEMS[user.role] ?? []) : [];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ── Desktop / Tablet Navbar ────────────────────── */}
      <header className='fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-neutral-200 shadow-sm'>
        <div className='flex items-center justify-between h-full px-4 md:px-6'>
          {/* Left: sidebar toggle (md+) + logo */}
          <div className='flex items-center gap-3'>
            {/* Sidebar hamburger — only shown when sidebar is used */}
            {user && (
              <button
                onClick={onMenuToggle}
                className='hidden md:flex items-center justify-center w-9 h-9 rounded-md text-neutral-500 hover:text-primary hover:bg-primary-light transition-colors duration-150'
                aria-label='Toggle sidebar'
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Logo */}
            <Link
              to='/'
              className='flex items-center gap-2.5 group'
              aria-label='EcoFlow home'
            >
              <EcoFlowLogo />
              <span className='text-xl font-bold tracking-tight'>
                <span className='text-primary'>Eco</span>
                <span className='text-secondary'>Flow</span>
              </span>
            </Link>
          </div>

          {/* Center: nav links — hidden on mobile */}
          {user && (
            <nav
              className='hidden lg:flex items-center gap-1'
              aria-label='Main navigation'
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive(item.path)
                      ? "text-primary bg-primary-light"
                      : "text-neutral-500 hover:text-primary hover:bg-neutral-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right: actions */}
          <div className='flex items-center gap-1.5'>
            {user ? (
              <>
                <NotificationBell count={3} />
                <UserDropdown user={user} onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='btn btn-tertiary btn-sm hidden sm:inline-flex'
                >
                  Sign in
                </Link>
                <Link to='/register' className='btn btn-primary  btn-sm'>
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className='flex md:hidden items-center justify-center w-9 h-9 rounded-md text-neutral-500 hover:text-primary hover:bg-primary-light transition-colors duration-150 ml-1'
                aria-label='Toggle mobile menu'
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────── */}
      {mobileOpen && user && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-30 bg-black/30 md:hidden'
            onClick={() => setMobileOpen(false)}
            aria-hidden='true'
          />

          {/* Drawer panel */}
          <div className='fixed top-16 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-lg md:hidden animate-slide-down'>
            <nav className='px-4 py-3 space-y-1' aria-label='Mobile navigation'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive(item.path)
                      ? "text-primary bg-primary-light font-semibold"
                      : "text-neutral-500 hover:text-primary hover:bg-neutral-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile user info */}
            <div className='flex items-center justify-between px-4 py-3 border-t border-neutral-100'>
              <div>
                <p className='text-sm font-semibold text-neutral-800'>
                  {user?.name}
                </p>
                <p className='text-xs text-neutral-400 capitalize'>
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='flex items-center gap-1.5 text-sm text-error font-medium hover:underline'
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Spacer so content doesn't sit under fixed navbar */}
      <div className='h-16' aria-hidden='true' />
    </>
  );
};

export default Navbar;
