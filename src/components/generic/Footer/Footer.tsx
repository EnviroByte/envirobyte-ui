import React from "react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** Links shown on the left side of the top bar. Defaults to Privacy Policy, Licensing, Contact */
  links?: FooterLink[];
  /** Company name used in copyright and branding. Defaults to "EnviroByte" */
  companyName?: string;
  /** Company website URL. Defaults to "EnviroByte.com" */
  websiteUrl?: string;
  /** Contact email. Defaults to "info@envirobyte.com" */
  contactEmail?: string;
  /** City/location shown in the bottom strip. Defaults to "Calgary, Alberta, Canada" */
  location?: string;
  /** Copyright year. Defaults to current year */
  year?: number;
}

const defaultLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Licensing", href: "/licensing" },
  { label: "Contact", href: "/contact" },
];

export function Footer({
  links = defaultLinks,
  companyName = "EnviroByte",
  websiteUrl = "EnviroByte.com",
  contactEmail = "info@envirobyte.com",
  location = "Calgary, Alberta, Canada",
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:border-zinc-800/60 dark:bg-zinc-950">
      {/* Top bar — full width; links/meta pinned to opposite edges (stacked on narrow screens) */}
      <div className="flex w-full min-w-0 flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: nav links */}
        <nav className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 self-start sm:self-auto">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-zinc-500 dark:hover:text-zinc-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: copyright + site + email */}
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-2 self-end text-right text-sm text-gray-500 sm:self-auto sm:text-right dark:text-zinc-500">
          <span>© {year} {companyName}</span>
          <span className="text-gray-300 dark:text-zinc-700">|</span>
          <a
            href={`https://${websiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-800 dark:hover:text-zinc-200"
          >
            {websiteUrl}
          </a>
          <span className="text-gray-300 dark:text-zinc-700">|</span>
          <a
            href={`mailto:${contactEmail}`}
            className="transition-colors hover:text-gray-800 dark:hover:text-zinc-200"
          >
            {contactEmail}
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-gray-50 px-6 py-3 text-center dark:bg-zinc-950 dark:border-t dark:border-zinc-800/40">
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Designed and Coded by {companyName} in {location}{" "}
          <span role="img" aria-label="Canadian flag">🇨🇦</span>
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-400">
          {companyName} Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
