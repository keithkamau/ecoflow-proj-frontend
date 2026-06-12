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
  ChevronLeft,
  ChevronRight,
  Recycle,
} from "lucide-react";
import { NAV_ITEMS, ROLES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

// ─── Icon map — matches icon strings in constants.js ──────────
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
};

// ─── Single Nav Item ───────────────────────────────────────────
const SidebarItem = ({ item, isActive, collapsed }) => {
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;

  return (
    <li>
      <Link
        to={item.path}
        title={collapsed ? item.label : undefined}
        className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-md
          text-sm font-medium transition-all duration-150
          ${
            isActive
              ? "bg-primary-light text-primary font-semibold"
              : "text-neutral-500 hover:bg-primary-light hover:text-primary"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full' />
        )}

        {/* Icon */}
        <Icon
          size={18}
          className={`shrink-0 transition-colors duration-150 ${
            isActive
              ? "text-primary"
              : "text-neutral-400 group-hover:text-primary"
          }`}
        />

        {/* Label — hidden when collapsed */}
        {!collapsed && <span className='truncate'>{item.label}</span>}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <span
            className='
              absolute left-full ml-3 px-2.5 py-1.5 z-50
              bg-neutral-900 text-white text-xs font-medium
              rounded-md shadow-lg whitespace-nowrap pointer-events-none
              opacity-0 group-hover:opacity-100
              translate-x-1 group-hover:translate-x-0
              transition-all duration-150
            '
          >
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );
};

// ─── Section Divider with label ───────────────────────────────
const SidebarSection = ({ label, collapsed }) => (
  <li className='pt-4 pb-1'>
    {!collapsed ? (
      <span className='overline px-3'>{label}</span>
    ) : (
      <div className='border-t border-neutral-200 mx-3' />
    )}
  </li>
);

// ─── Impact Summary (seller / recycler) ───────────────────────
const ImpactSummary = ({ collapsed }) => {
  if (collapsed) return null;
  return (
    <div className='mx-3 mb-4 p-3 bg-primary-light rounded-md border border-primary/20'>
      <div className='flex items-center gap-2 mb-2'>
        <Recycle size={14} className='text-primary' />
        <span className='text-xs font-semibold text-primary'>Your Impact</span>
      </div>
      <div className='space-y-1'>
        <div className='flex justify-between text-xs'>
          <span className='text-neutral-500'>Recycled</span>
          <span className='font-semibold text-primary'>0 kg</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-neutral-500'>CO₂ Saved</span>
          <span className='font-semibold text-primary'>0 kg</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Sidebar ──────────────────────────────────────────────
const Sidebar = ({ open }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user?.role ? (NAV_ITEMS[user.role] ?? []) : [];

  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  // ── Group items into sections ──────────────────────
  const getGroupedItems = () => {
    if (!user?.role) return { main: navItems, secondary: [] };

    if (user.role === ROLES.ADMIN) {
      return {
        main: navItems.slice(0, 4),
        secondary: navItems.slice(4),
      };
    }
    return {
      main: navItems.slice(0, 4),
      secondary: navItems.slice(4),
    };
  };

  const { main, secondary } = getGroupedItems();

  if (!open) return null;

  return (
    <>
      {/* ── Sidebar panel ──────────────────────────────── */}
      <aside
        style={{ width: collapsed ? "72px" : "240px" }}
        className={`
          fixed top-16 left-0 bottom-0 z-30
          bg-white border-r border-neutral-200
          flex flex-col
          transition-all duration-300 ease-in-out
          hidden md:flex
          overflow-hidden
        `}
        aria-label='Sidebar navigation'
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className='
            absolute -right-3 top-6 z-10
            flex items-center justify-center
            w-6 h-6 rounded-full
            bg-white border border-neutral-200 shadow-sm
            text-neutral-400 hover:text-primary
            transition-colors duration-150
          '
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Nav list */}
        <div className='flex-1 overflow-y-auto overflow-x-hidden py-4 no-scrollbar'>
          <nav aria-label='Sidebar navigation'>
            <ul className='space-y-0.5 px-2'>
              {/* Main items */}
              {!collapsed && (
                <SidebarSection label='Main' collapsed={collapsed} />
              )}
              {main.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  collapsed={collapsed}
                />
              ))}

              {/* Secondary items */}
              {secondary.length > 0 && (
                <>
                  <SidebarSection
                    label={
                      user?.role === ROLES.ADMIN ? "Management" : "Insights"
                    }
                    collapsed={collapsed}
                  />
                  {secondary.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      isActive={isActive(item.path)}
                      collapsed={collapsed}
                    />
                  ))}
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom: impact summary + role badge */}
        <div className='border-t border-neutral-100 pb-4 pt-3'>
          {(user?.role === ROLES.SELLER || user?.role === ROLES.RECYCLER) && (
            <ImpactSummary collapsed={collapsed} />
          )}

          {/* Role pill */}
          {!collapsed && (
            <div className='flex items-center gap-2 px-4'>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  user?.role === ROLES.ADMIN
                    ? "bg-error-light text-error-dark"
                    : user?.role === ROLES.RECYCLER
                      ? "bg-info-light text-info-dark"
                      : "bg-primary-light text-primary-dark"
                }`}
              >
                {user?.role}
              </span>
              <span className='text-xs text-neutral-400 truncate'>
                {user?.name}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Content offset — pushes main content right ── */}
      <div
        style={{ marginLeft: collapsed ? "72px" : "240px" }}
        className='hidden md:block transition-all duration-300'
        aria-hidden='true'
      />
    </>
  );
};

export default Sidebar;
