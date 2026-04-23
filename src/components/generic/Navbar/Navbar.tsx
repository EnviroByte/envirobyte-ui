import React, { useState, useRef, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavbarApp {
  /** App name shown in the switcher */
  label: string;
  /** URL to navigate to */
  href: string;
  /** Icon element (SVG or img) */
  icon?: React.ReactNode;
}

export interface NavbarCompany {
  /** Company name shown in breadcrumb */
  name: string;
  /** Optional facility/site name shown after the company */
  facilityName?: string;
  /** Icon element for the facility pill */
  facilityIcon?: React.ReactNode;
}

export interface NavbarUser {
  /** Display name */
  name: string;
  /** Email address */
  email: string;
  /** Role or company context e.g. "admin at Demo Company 1" */
  role?: string;
  /** Avatar URL — falls back to initials if not provided */
  avatarUrl?: string;
}

export interface NavbarProps {
  /** Current app name shown in the sidebar header area */
  appName?: string;
  /** User info for the avatar dropdown */
  user: NavbarUser;
  /** List of apps shown in the app switcher */
  apps?: NavbarApp[];
  /** Company/facility context — pass this to enable the company switcher breadcrumb */
  company?: NavbarCompany;
  /** Whether to show the company switcher in the breadcrumb and user dropdown */
  showCompanySwitcher?: boolean;
  /** Whether to show the notifications bell */
  showNotifications?: boolean;
  /** Notification count — shows badge if > 0 */
  notificationCount?: number;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Called when search value changes */
  onSearchChange?: (value: string) => void;
  /** Current theme — controls the toggle display */
  theme?: "light" | "dark";
  /** Called when the theme toggle is clicked */
  onThemeToggle?: () => void;
  /** Called when "Change Company" is clicked */
  onChangeCompany?: () => void;
  /** Called when "Change Log" is clicked */
  onChangeLog?: () => void;
  /** Called when "Settings" is clicked */
  onSettings?: () => void;
  /** Called when "Sign Out" is clicked */
  onSignOut?: () => void;
  /** Called when a notification bell is clicked */
  onNotificationsClick?: () => void;
  /** Called when the company breadcrumb is clicked */
  onCompanyClick?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function useOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ChangeLogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CompanyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user }: { user: NavbarUser }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
      {getInitials(user.name)}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Navbar({
  user,
  apps = [],
  company,
  showCompanySwitcher = false,
  showNotifications = true,
  notificationCount = 0,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  theme = "light",
  onThemeToggle,
  onChangeCompany,
  onChangeLog,
  onSettings,
  onSignOut,
  onNotificationsClick,
  onCompanyClick,
}: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null!);
  const appSwitcherRef = useRef<HTMLDivElement>(null!);

  useOutsideClick(userMenuRef, () => setUserMenuOpen(false));
  useOutsideClick(appSwitcherRef, () => setAppSwitcherOpen(false));

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    onSearchChange?.(e.target.value);
  }

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">

      {/* ── Left: Company / Facility Breadcrumb ── */}
      <div className="flex items-center gap-2">
        {showCompanySwitcher && company ? (
          <button
            onClick={onCompanyClick}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span>{company.name}</span>
            {company.facilityName && (
              <>
                <ChevronRightIcon className="text-gray-400" />
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {company.facilityIcon && <span className="text-primary-500">{company.facilityIcon}</span>}
                  {company.facilityName}
                </span>
              </>
            )}
          </button>
        ) : (
          // Empty spacer so right-side items stay aligned
          <div />
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative ml-2 hidden sm:block">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="h-8 w-48 rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-gray-200 px-1 text-[10px] text-gray-400 dark:border-gray-700">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        {showNotifications && (
          <button
            onClick={onNotificationsClick}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Notifications"
          >
            <BellIcon />
            {notificationCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        )}

        {/* App Switcher */}
        {apps.length > 0 && (
          <div ref={appSwitcherRef} className="relative">
            <button
              onClick={() => setAppSwitcherOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="App switcher"
            >
              <GridIcon />
            </button>

            {appSwitcherOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-dropdown dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  EnviroBytes App Hub
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {apps.map((app, i) => (
                    <a
                      key={i}
                      href={app.href}
                      className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {app.icon && (
                        <span className="flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-300">
                          {app.icon}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {app.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Menu */}
        <div ref={userMenuRef} className="relative ml-1">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="User menu"
          >
            <Avatar user={user} />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-gray-800 dark:text-gray-100">
                {user.name}
              </p>
              {user.role && (
                <p className="text-xs leading-tight text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
              )}
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-dropdown dark:border-gray-700 dark:bg-gray-900">
              {/* User info header */}
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                {user.role && (
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{user.role}</p>
                )}
              </div>

              <div className="py-1">
                {/* Change Company — only for apps with switcher */}
                {showCompanySwitcher && onChangeCompany && (
                  <button
                    onClick={() => { onChangeCompany(); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-primary-600 transition-colors hover:bg-gray-50 dark:text-primary-400 dark:hover:bg-gray-800"
                  >
                    <CompanyIcon />
                    Change Company
                  </button>
                )}

                {/* Change Log */}
                {onChangeLog && (
                  <button
                    onClick={() => { onChangeLog(); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChangeLogIcon />
                    Change Log
                  </button>
                )}

                {/* Settings */}
                {onSettings && (
                  <button
                    onClick={() => { onSettings(); setUserMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <SettingsIcon />
                    Settings
                  </button>
                )}

                {/* Theme toggle in dropdown */}
                <button
                  onClick={() => { onThemeToggle?.(); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              {/* Sign out */}
              <div className="border-t border-gray-100 py-1 dark:border-gray-800">
                <button
                  onClick={() => { onSignOut?.(); setUserMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <SignOutIcon />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
