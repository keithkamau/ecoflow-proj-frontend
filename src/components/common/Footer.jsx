import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  MessageCircle,
  Share2,
  Users,
  Mail,
  Phone,
  MapPin,
  Leaf,
} from "lucide-react";
import { getGlobalStats } from "../../services/analyticsService";

const C = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  neutral800: "#1F2937",
  neutral700: "#374151",
  neutral500: "var(--color-neutral-500)",
  neutral400: "var(--color-neutral-400)",
  neutral300: "var(--color-neutral-300)",
  neutral100: "var(--color-neutral-100)",
  white: "#ffffff",
  bg: "#111827",
  bgAlt: "#1F2937",
};

const SOCIALS = [
  { Icon: Globe, href: "#", label: "Twitter" },
  { Icon: MessageCircle, href: "#", label: "LinkedIn" },
  { Icon: Share2, href: "#", label: "Instagram" },
  { Icon: Users, href: "#", label: "Facebook" },
];

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "Browse Listings", to: "/browse" },
      { label: "Create Listing", to: "/listings/new" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Impact Dashboard", to: "/analytics/impact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About EcoFlow", to: "/about" },
      { label: "Our Mission", to: "/mission" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

function FooterLink({ label, to }) {
  return (
    <li style={{ listStyle: "none" }}>
      <Link
        to={to}
        style={{
          fontSize: "0.875rem",
          color: C.neutral400,
          textDecoration: "none",
          transition: "color 150ms",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.neutral400)}
      >
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getGlobalStats().then(setStats).catch(() => {});
  }, []);

  const s = stats || {};

  return (
    <footer style={{ background: C.bg, color: C.white }}>
      {/* Stats bar */}
      <div style={{ background: C.bgAlt, borderBottom: `1px solid #374151` }}>
        <div
          style={{ maxWidth: "80rem", margin: "0 auto", padding: "24px 24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 16,
              textAlign: "center",
            }}
            className='stats-grid'
          >
            {[
              { value: `${Math.round(s.total_kg_recycled || 0)}+`, label: "kg Recycled" },
              { value: `${s.total_transactions || 0}+`, label: "Transactions" },
              { value: `${s.total_members || 0}+`, label: "Members" },
              { value: `${Math.round(s.co2_saved_kg || 0)} kg`, label: "CO\u2082 Saved" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.primary,
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: C.neutral400,
                    marginTop: 2,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{ maxWidth: "80rem", margin: "0 auto", padding: "48px 24px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 32,
          }}
          className='footer-grid'
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <Link
              to='/'
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                textDecoration: "none",
              }}
            >
              <svg
                width='28'
                height='28'
                viewBox='0 0 32 32'
                fill='none'
                aria-hidden='true'
              >
                <circle cx='16' cy='16' r='15' stroke='#fff' strokeWidth='2' />
                <path
                  d='M16 5 C20 5, 24 9, 24 13 C24 17, 20 19, 16 19'
                  stroke='#fff'
                  strokeWidth='2.2'
                  strokeLinecap='round'
                  fill='none'
                />
                <path
                  d='M16 19 C12 19, 8 17, 8 13 C8 9, 12 7, 16 7'
                  stroke='#F97316'
                  strokeWidth='2.2'
                  strokeLinecap='round'
                  fill='none'
                />
                <path
                  d='M14 17 L16 19 L18 17'
                  stroke='#F97316'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                />
              </svg>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                <span style={{ color: C.primary }}>Eco</span>
                <span style={{ color: C.secondary }}>Flow</span>
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.875rem",
                color: C.neutral400,
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Transforming waste into resources through a transparent,
              community-driven marketplace for the circular economy.
            </p>
            {/* Contact */}
            {[
              { Icon: MapPin, text: "Nairobi, Kenya", href: null },
              {
                Icon: Mail,
                text: "hello@ecoflow.co.ke",
                href: "mailto:hello@ecoflow.co.ke",
              },
              {
                Icon: Phone,
                text: "+254 700 000 000",
                href: "tel:+254700000000",
              },
            ].map(({ Icon, text, href }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Icon size={13} color={C.primary} style={{ flexShrink: 0 }} />
                {href ? (
                  <a
                    href={href}
                    style={{
                      fontSize: "0.75rem",
                      color: C.neutral400,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.neutral400)
                    }
                  >
                    {text}
                  </a>
                ) : (
                  <span style={{ fontSize: "0.75rem", color: C.neutral400 }}>
                    {text}
                  </span>
                )}
              </div>
            ))}
            {/* Socials */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: C.bgAlt,
                    color: C.neutral400,
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.primary;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.bgAlt;
                    e.currentTarget.style.color = C.neutral400;
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                {title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {links.map((l) => (
                  <FooterLink key={l.to} {...l} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid #374151` }}>
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: "0.75rem", color: C.neutral500 }}>
            © {year} EcoFlow Technologies Ltd. All rights reserved.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.75rem",
              color: C.primary,
            }}
          >
            <Leaf size={13} /> Built for the circular economy
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Cookies", "/cookies"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: "0.75rem",
                  color: C.neutral500,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.neutral300)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.neutral500)
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:900px) { .footer-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width:600px) { .footer-grid { grid-template-columns: 1fr !important; } .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </footer>
  );
}
