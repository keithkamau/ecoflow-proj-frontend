import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Leaf,
  ExternalLink,
} from "lucide-react";

// ─── EcoFlow Logo (white variant for dark footer) ──────────────
const EcoFlowLogoWhite = () => (
  <svg
    width='30'
    height='30'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='EcoFlow logo'
  >
    <circle cx='16' cy='16' r='15' stroke='#ffffff' strokeWidth='2' />
    <path
      d='M16 5 C20 5, 24 9, 24 13 C24 17, 20 19, 16 19'
      stroke='#ffffff'
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
);

// ─── Social Links Config ───────────────────────────────────────
const SOCIAL_LINKS = [
  { icon: ExternalLink, href: "https://twitter.com/ecoflow", label: "Twitter" },
  { icon: ExternalLink, href: "https://linkedin.com/company/ecoflow", label: "LinkedIn" },
  { icon: ExternalLink, href: "https://instagram.com/ecoflow", label: "Instagram" },
  { icon: ExternalLink, href: "https://facebook.com/ecoflow", label: "Facebook" },
];

// ─── Footer Link Columns ───────────────────────────────────────
const FOOTER_LINKS = {
  platform: {
    title: "Platform",
    links: [
      { label: "Browse Listings", to: "/browse" },
      { label: "Create Listing", to: "/listings/new" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Pricing", to: "/pricing" },
      { label: "Impact Dashboard", to: "/analytics/impact" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About EcoFlow", to: "/about" },
      { label: "Our Mission", to: "/mission" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
      { label: "Blog", to: "/blog" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Contact Us", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
};

// ─── Impact Stats ──────────────────────────────────────────────
const IMPACT_STATS = [
  { value: "0+", label: "kg Recycled" },
  { value: "0+", label: "Transactions" },
  { value: "0+", label: "Active Members" },
  { value: "0 kg", label: "CO₂ Saved" },
];

// ─── Link column component ─────────────────────────────────────
const FooterLinkColumn = ({ title, links }) => (
  <div>
    <h4 className='text-sm font-semibold text-white mb-4 tracking-wide'>
      {title}
    </h4>
    <ul className='space-y-2.5'>
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className='text-sm text-neutral-400 hover:text-primary transition-colors duration-150 flex items-center gap-1 group'
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main Footer ───────────────────────────────────────────────
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-neutral-900 text-white' aria-label='Site footer'>
      {/* ── Impact stats bar ───────────────────────────── */}
      <div className='border-b border-neutral-700 bg-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 text-center'>
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label}>
                <p className='text-2xl font-bold text-primary'>{stat.value}</p>
                <p className='text-xs text-neutral-400 mt-0.5'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer grid ───────────────────────────── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* Brand column */}
          <div className='sm:col-span-2 lg:col-span-1'>
            {/* Logo */}
            <Link to='/' className='flex items-center gap-2.5 mb-4 group'>
              <EcoFlowLogoWhite />
              <span className='text-xl font-bold tracking-tight'>
                <span className='text-primary'>Eco</span>
                <span className='text-secondary'>Flow</span>
              </span>
            </Link>

            {/* Mission */}
            <p className='text-sm text-neutral-400 leading-relaxed mb-5'>
              Transforming waste into resources through a transparent,
              community-driven marketplace. Empowering communities to
              participate in the circular economy.
            </p>

            {/* Contact */}
            <ul className='space-y-2 mb-6'>
              <li className='flex items-center gap-2 text-xs text-neutral-400'>
                <MapPin size={13} className='text-primary shrink-0' />
                Nairobi, Kenya
              </li>
              <li className='flex items-center gap-2 text-xs text-neutral-400'>
                <Mail size={13} className='text-primary shrink-0' />
                <a
                  href='mailto:hello@ecoflow.co.ke'
                  className='hover:text-primary transition-colors duration-150'
                >
                  hello@ecoflow.co.ke
                </a>
              </li>
              <li className='flex items-center gap-2 text-xs text-neutral-400'>
                <Phone size={13} className='text-primary shrink-0' />
                <a
                  href='tel:+254700000000'
                  className='hover:text-primary transition-colors duration-150'
                >
                  +254 700 000 000
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className='flex items-center gap-3'>
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='
                    flex items-center justify-center w-8 h-8 rounded-md
                    text-neutral-400 bg-neutral-800
                    hover:text-white hover:bg-primary
                    transition-all duration-150
                  '
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterLinkColumn {...FOOTER_LINKS.platform} />
          <FooterLinkColumn {...FOOTER_LINKS.company} />
          <FooterLinkColumn {...FOOTER_LINKS.support} />
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className='border-t border-neutral-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3'>
          {/* Copyright */}
          <p className='text-xs text-neutral-500 text-center sm:text-left'>
            © {currentYear} EcoFlow Technologies Ltd. All rights reserved.
          </p>

          {/* Eco badge */}
          <div className='flex items-center gap-1.5 text-xs text-primary'>
            <Leaf size={13} />
            <span>Built for the circular economy</span>
          </div>

          {/* Legal links */}
          <div className='flex items-center gap-4'>
            {[
              { label: "Privacy", to: "/privacy" },
              { label: "Terms", to: "/terms" },
              { label: "Cookies", to: "/cookies" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='text-xs text-neutral-500 hover:text-neutral-300 transition-colors duration-150'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
