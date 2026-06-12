const SpinRing = ({
  size = 24,
  color = "#10B981",
  trackColor = "#D1FAE5",
  strokeWidth = 3,
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='animate-spin'
    aria-hidden='true'
  >
    {/* Track */}
    <circle
      cx='12'
      cy='12'
      r='10'
      stroke={trackColor}
      strokeWidth={strokeWidth}
    />
    {/* Active arc */}
    <path
      d='M12 2 A10 10 0 0 1 22 12'
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
    />
  </svg>
);

// ─── Eco Flow Icon (branded loader) ───────────────────────────
const EcoSpinIcon = ({ size = 40 }) => (
  <div className='flex flex-col items-center gap-3'>
    <svg
      width={size}
      height={size}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='animate-spin-slow'
      aria-hidden='true'
    >
      <circle cx='16' cy='16' r='14' stroke='#D1FAE5' strokeWidth='2' />
      <circle
        cx='16'
        cy='16'
        r='14'
        stroke='#10B981'
        strokeWidth='2'
        strokeLinecap='round'
        strokeDasharray='22 66'
        strokeDashoffset='0'
      />
      <path
        d='M16 6 C20 6, 23 9, 23 13 C23 17, 20 18, 16 18'
        stroke='#10B981'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M16 18 C12 18, 9 16, 9 13 C9 9, 12 8, 16 8'
        stroke='#F97316'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M14 16.5 L16 18.5 L18 16.5'
        stroke='#F97316'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </svg>
    <span className='text-sm font-medium text-primary animate-pulse'>
      Loading…
    </span>
  </div>
);

// ─── Pulsing Dots ──────────────────────────────────────────────
const DotsLoader = ({ color = "bg-primary" }) => (
  <div className='flex items-center gap-1.5' role='status' aria-label='Loading'>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={`w-2 h-2 rounded-full ${color} animate-pulse`}
        style={{ animationDelay: `${i * 200}ms` }}
      />
    ))}
    <span className='sr-only'>Loading…</span>
  </div>
);

// ─── Progress Bar ──────────────────────────────────────────────
const BarLoader = () => (
  <div
    className='w-full h-1 bg-primary-light rounded-full overflow-hidden'
    role='status'
    aria-label='Loading'
  >
    <div
      className='h-full bg-primary rounded-full'
      style={{
        animation: "bar-slide 1.4s ease-in-out infinite",
        width: "40%",
      }}
    />
    <style>{`
      @keyframes bar-slide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }
    `}</style>
    <span className='sr-only'>Loading…</span>
  </div>
);

// ─── Size presets ──────────────────────────────────────────────
const SIZE_MAP = {
  xs: { ring: 14, stroke: 2 },
  sm: { ring: 18, stroke: 2.5 },
  md: { ring: 24, stroke: 3 },
  lg: { ring: 36, stroke: 3.5 },
  xl: { ring: 48, stroke: 4 },
};

// ─── Default LoadingSpinner ────────────────────────────────────
/**
 * @param {string}  variant   — "ring" | "dots" | "bar" | "eco"
 * @param {string}  size      — "xs" | "sm" | "md" | "lg" | "xl"
 * @param {string}  color     — hex color for spinner arc
 * @param {string}  className — additional classes
 * @param {string}  label     — accessible label
 */
const LoadingSpinner = ({
  variant = "ring",
  size = "md",
  color = "#10B981",
  trackColor = "#D1FAE5",
  className = "",
  label = "Loading…",
}) => {
  const { ring, stroke } = SIZE_MAP[size] ?? SIZE_MAP.md;

  if (variant === "dots") return <DotsLoader />;
  if (variant === "bar") return <BarLoader />;
  if (variant === "eco")
    return <EcoSpinIcon size={SIZE_MAP[size]?.ring ?? 40} />;

  return (
    <span
      role='status'
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <SpinRing
        size={ring}
        color={color}
        trackColor={trackColor}
        strokeWidth={stroke}
      />
      <span className='sr-only'>{label}</span>
    </span>
  );
};

// ─── Full-Page Loader ──────────────────────────────────────────
/**
 * Covers the viewport with a centered EcoFlow branded loader.
 * Use during initial app load, page transitions, or auth checks.
 *
 * @param {string} message — optional loading message
 */
export const PageLoader = ({ message = "Loading EcoFlow…" }) => (
  <div
    role='status'
    aria-label={message}
    className='
      fixed inset-0 z-50 flex flex-col items-center justify-center
      bg-white/90 backdrop-blur-sm gap-5
    '
  >
    <EcoSpinIcon size={56} />
    {message && (
      <p className='text-sm text-neutral-500 animate-pulse'>{message}</p>
    )}
    <span className='sr-only'>{message}</span>
  </div>
);

// ─── Button Spinner (tiny, white, inline) ──────────────────────
/**
 * Drop this inside a <button> while submitting forms.
 * Example: <button disabled={loading}>{loading ? <ButtonSpinner /> : "Save"}</button>
 */
export const ButtonSpinner = ({ color = "#ffffff" }) => (
  <SpinRing
    size={16}
    color={color}
    trackColor='rgba(255,255,255,0.3)'
    strokeWidth={2.5}
  />
);

// ─── Skeleton Components ───────────────────────────────────────
// Shared pulse style
const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`bg-neutral-200 rounded animate-pulse ${className}`}
    aria-hidden='true'
  />
);

/**
 * Skeleton text block — mimics a paragraph or heading.
 * @param {number} lines  — number of text rows
 * @param {boolean} heading — first line is wider (heading style)
 */
export const SkeletonText = ({ lines = 3, heading = false }) => (
  <div className='space-y-2' aria-hidden='true'>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={`h-3.5 ${
          i === 0 && heading
            ? "w-2/5 h-5"
            : i === lines - 1
              ? "w-3/5"
              : "w-full"
        }`}
      />
    ))}
  </div>
);

/**
 * Skeleton card — placeholder for a listing/offer card while loading.
 */
export const SkeletonCard = () => (
  <div
    className='bg-white border border-neutral-200 rounded-md shadow-sm p-5 space-y-4'
    aria-hidden='true'
    aria-label='Loading content'
  >
    {/* Header row */}
    <div className='flex items-center gap-3'>
      <SkeletonBlock className='w-10 h-10 rounded-full shrink-0' />
      <div className='flex-1 space-y-2'>
        <SkeletonBlock className='h-4 w-2/5' />
        <SkeletonBlock className='h-3 w-1/4' />
      </div>
      <SkeletonBlock className='h-6 w-16 rounded-full' />
    </div>

    {/* Body */}
    <SkeletonText lines={2} />

    {/* Stat row */}
    <div className='flex items-center gap-4 pt-1'>
      <SkeletonBlock className='h-3 w-16' />
      <SkeletonBlock className='h-3 w-20' />
      <SkeletonBlock className='h-3 w-12' />
    </div>

    {/* Footer */}
    <div className='flex justify-between items-center pt-2 border-t border-neutral-100'>
      <SkeletonBlock className='h-4 w-20' />
      <SkeletonBlock className='h-8 w-24 rounded-md' />
    </div>
  </div>
);

/**
 * Skeleton list — multiple skeleton rows (for tables / list views).
 * @param {number} rows  — number of skeleton rows
 */
export const SkeletonList = ({ rows = 4 }) => (
  <div className='space-y-2' aria-hidden='true' aria-label='Loading list'>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className='flex items-center gap-3 px-4 py-3 bg-white border border-neutral-200 rounded-md'
      >
        <SkeletonBlock className='w-8 h-8 rounded-full shrink-0' />
        <div className='flex-1 space-y-1.5'>
          <SkeletonBlock className='h-3.5 w-1/3' />
          <SkeletonBlock className='h-3 w-1/2' />
        </div>
        <SkeletonBlock className='h-6 w-16 rounded-full' />
        <SkeletonBlock className='h-8 w-20 rounded-md' />
      </div>
    ))}
  </div>
);

/**
 * Skeleton grid — for cards in a grid layout.
 * @param {number} count  — number of skeleton cards
 * @param {string} cols   — Tailwind grid-cols class
 */
export const SkeletonGrid = ({
  count = 6,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) => (
  <div className={`grid ${cols} gap-4`} aria-hidden='true'>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSpinner;
