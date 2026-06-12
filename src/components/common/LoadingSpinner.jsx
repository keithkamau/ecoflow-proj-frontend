const C = {
  primary: "var(--color-primary)",
  primaryLight: "var(--color-primary-light)",
  secondary: "var(--color-secondary)",
  neutral200: "var(--color-neutral-200)",
  neutral500: "var(--color-neutral-500)",
  neutral900: "var(--color-neutral-900)",
  neutral50: "var(--color-neutral-50)",
};

/* ── Spin ring SVG ───────────────────────────────────────────── */
function SpinRing({
  size = 24,
  color = C.primary,
  track = C.primaryLight,
  stroke = 3,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      style={{ animation: "spin 1s linear infinite" }}
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='10' stroke={track} strokeWidth={stroke} />
      <path
        d='M12 2 A10 10 0 0 1 22 12'
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap='round'
      />
    </svg>
  );
}

/* ── Eco brand icon ──────────────────────────────────────────── */
function EcoIcon({ size = 48 }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox='0 0 32 32'
        fill='none'
        className='animate-spin-slow'
        aria-hidden='true'
      >
        <circle
          cx='16'
          cy='16'
          r='14'
          stroke={C.primaryLight}
          strokeWidth='2'
        />
        <circle
          cx='16'
          cy='16'
          r='14'
          stroke={C.primary}
          strokeWidth='2'
          strokeLinecap='round'
          strokeDasharray='22 66'
        />
        <path
          d='M16 6 C20 6,23 9,23 13 C23 17,20 18,16 18'
          stroke={C.primary}
          strokeWidth='2'
          strokeLinecap='round'
          fill='none'
        />
        <path
          d='M16 18 C12 18,9 16,9 13 C9 9,12 8,16 8'
          stroke={C.secondary}
          strokeWidth='2'
          strokeLinecap='round'
          fill='none'
        />
        <path
          d='M14 16.5 L16 18.5 L18 16.5'
          stroke={C.secondary}
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </svg>
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: C.primary,
          animation: "skeleton-pulse 1.5s ease-in-out infinite",
        }}
      >
        Loading…
      </span>
    </div>
  );
}

/* ── Pulsing dots ────────────────────────────────────────────── */
function Dots() {
  return (
    <div
      role='status'
      aria-label='Loading'
      style={{ display: "flex", alignItems: "center", gap: 6 }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.primary,
            animation: `skeleton-pulse 1.5s ease-in-out ${i * 200}ms infinite`,
          }}
        />
      ))}
      <span style={{ position: "absolute", left: "-9999px" }}>Loading…</span>
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────────── */
function Bar() {
  return (
    <div
      role='status'
      aria-label='Loading'
      style={{
        width: "100%",
        height: 4,
        background: C.primaryLight,
        borderRadius: 9999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "40%",
          background: C.primary,
          borderRadius: 9999,
          animation: "bar-slide 1.4s ease-in-out infinite",
        }}
      />
      <span style={{ position: "absolute", left: "-9999px" }}>Loading…</span>
    </div>
  );
}

const SIZES = { xs: 14, sm: 18, md: 24, lg: 36, xl: 48 };

/* ── Default export ──────────────────────────────────────────── */
export default function LoadingSpinner({
  variant = "ring",
  size = "md",
  color = C.primary,
  className = "",
}) {
  const px = SIZES[size] ?? 24;
  if (variant === "dots") return <Dots />;
  if (variant === "bar") return <Bar />;
  if (variant === "eco") return <EcoIcon size={px} />;
  return (
    <span
      role='status'
      aria-label='Loading'
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SpinRing size={px} color={color} />
      <span style={{ position: "absolute", left: "-9999px" }}>Loading…</span>
    </span>
  );
}

/* ── Page loader overlay ─────────────────────────────────────── */
export function PageLoader({ message = "Loading EcoFlow…" }) {
  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
      <div
        role='status'
        aria-label={message}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(4px)",
          gap: 20,
        }}
      >
        <EcoIcon size={56} />
        {message && (
          <p style={{ fontSize: "0.875rem", color: C.neutral500 }}>{message}</p>
        )}
      </div>
    </>
  );
}

/* ── Button spinner (tiny, white) ────────────────────────────── */
export function ButtonSpinner({ color = "#fff" }) {
  return (
    <SpinRing
      size={16}
      color={color}
      track='rgba(255,255,255,0.3)'
      stroke={2.5}
    />
  );
}

/* ── Skeleton building block ─────────────────────────────────── */
function Bone({ style = {} }) {
  return (
    <div
      aria-hidden='true'
      style={{
        background: C.neutral200,
        borderRadius: 4,
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

/* ── Skeleton text ───────────────────────────────────────────── */
export function SkeletonText({ lines = 3, heading = false }) {
  return (
    <div
      aria-hidden='true'
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Bone
          key={i}
          style={{
            height: i === 0 && heading ? 20 : 14,
            width:
              i === 0 && heading ? "40%" : i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

/* ── Skeleton card ───────────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div
      aria-hidden='true'
      aria-label='Loading content'
      style={{
        background: "#fff",
        border: `1px solid ${C.neutral200}`,
        borderRadius: 8,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Bone
          style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }}
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
        >
          <Bone style={{ height: 14, width: "40%" }} />
          <Bone style={{ height: 12, width: "25%" }} />
        </div>
        <Bone style={{ height: 22, width: 60, borderRadius: 9999 }} />
      </div>
      <SkeletonText lines={2} />
      <div style={{ display: "flex", gap: 16 }}>
        <Bone style={{ height: 12, width: 60 }} />
        <Bone style={{ height: 12, width: 80 }} />
        <Bone style={{ height: 12, width: 50 }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: `1px solid ${C.neutral200}`,
        }}
      >
        <Bone style={{ height: 14, width: 80 }} />
        <Bone style={{ height: 32, width: 96, borderRadius: 6 }} />
      </div>
    </div>
  );
}

/* ── Skeleton list ───────────────────────────────────────────── */
export function SkeletonList({ rows = 4 }) {
  return (
    <div
      aria-hidden='true'
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "#fff",
            border: `1px solid ${C.neutral200}`,
            borderRadius: 6,
          }}
        >
          <Bone
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <Bone style={{ height: 14, width: "33%" }} />
            <Bone style={{ height: 12, width: "50%" }} />
          </div>
          <Bone style={{ height: 22, width: 64, borderRadius: 9999 }} />
          <Bone style={{ height: 32, width: 80, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

/* ── Skeleton grid ───────────────────────────────────────────── */
export function SkeletonGrid({ count = 6 }) {
  return (
    <div
      aria-hidden='true'
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
