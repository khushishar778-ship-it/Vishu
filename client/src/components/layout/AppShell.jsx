import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { apiGet } from "../../api/client";
import { useAuth } from "../../store/auth";

const navConfig = {
  ADMIN: ["dashboard", "workers", "children", "ai-logs", "call-logs", "messages", "alerts", "plans", "notifications", "profile", "settings", "admin"],
  SUPERVISOR: ["dashboard", "workers", "children", "ai-logs", "call-logs", "messages", "alerts", "plans", "notifications", "profile", "settings"],
  WORKER: ["dashboard", "children", "messages", "notifications", "profile", "settings"]
};

const navIcons = {
  dashboard: "DB",
  workers: "WK",
  children: "CH",
  "ai-logs": "AI",
  "call-logs": "CL",
  messages: "MS",
  alerts: "AL",
  plans: "PL",
  notifications: "NT",
  profile: "PR",
  settings: "ST",
  admin: "AD"
};

function BrandLogo() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/60 bg-[linear-gradient(140deg,#fef4dd_0%,#f3b971_45%,#d85a30_100%)] shadow-[0_14px_28px_rgba(216,90,48,0.28)]">
      <div className="absolute inset-1 rounded-[1rem] border border-white/45" />
      <span className="relative text-lg font-bold tracking-[0.28em] text-white">AW</span>
    </div>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M15 17H9m9-1a3 3 0 0 1-3-3V11a3 3 0 1 0-6 0v2a3 3 0 0 1-3 3l-.75.75V18h13.5v-1.25L18 16Zm-4.5 2a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, setUser, logoutMutation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "header"],
    queryFn: async () => apiGet("/notifications"),
    enabled: Boolean(user)
  });

  const unreadCount = notificationsQuery.data?.notifications?.filter((item) => !item.isRead).length || 0;
  const navItems = (navConfig[user?.role] || []).map((key) => ({
    key,
    label: t(key),
    shortLabel: navIcons[key] || key.slice(0, 2).toUpperCase(),
    href: `/${key === "dashboard" ? "dashboard" : key}`
  }));

  const activeItem = navItems.find((item) => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`));

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("anganwadi-language", nextLanguage);
    if (user) {
      setUser({ ...user, languagePreference: nextLanguage });
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(216,90,48,0.14),_transparent_28%),radial-gradient(circle_at_right,_rgba(243,185,113,0.18),_transparent_30%),linear-gradient(180deg,#fff9f2_0%,#f8efe4_100%)]">
        <div className="border-b border-[#2f2417]/10 bg-[#2f2417] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#f8e8ce] sm:px-6">
          Integrated Child Development Dashboard
        </div>

        <header className="border-b border-[#d8c2a7] bg-[linear-gradient(180deg,rgba(255,248,239,0.98)_0%,rgba(250,240,228,0.95)_100%)] shadow-[0_12px_40px_rgba(86,53,22,0.08)] backdrop-blur">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <BrandLogo />
                <div className="min-w-0">
                  <Link to="/dashboard" className="inline-flex max-w-full flex-col text-secondary">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-primary/80">{t("appTagline")}</span>
                    <span className="truncate text-2xl font-semibold tracking-tight">{t("appName")}</span>
                    <span className="text-sm text-muted">{t("appSubtitle")}</span>
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center rounded-full border border-[#d8b18c] bg-white/85 p-1 text-sm font-medium shadow-sm"
                  onClick={toggleLanguage}
                  type="button"
                >
                  <span className={clsx("rounded-full px-4 py-2 transition-colors", i18n.language === "en" ? "bg-primary text-white shadow-sm" : "text-muted")}>
                    {t("languageEnglish")}
                  </span>
                  <span className={clsx("rounded-full px-4 py-2 transition-colors", i18n.language === "hi" ? "bg-primary text-white shadow-sm font-devanagari" : "text-muted font-devanagari")}>
                    {t("languageHindi")}
                  </span>
                </button>

                <button
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b18c] bg-white/85 text-secondary transition hover:border-primary hover:text-primary"
                  onClick={() => navigate("/notifications")}
                  type="button"
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  className="inline-flex items-center gap-3 rounded-full border border-[#d8b18c] bg-white/90 px-4 py-2.5 text-left text-secondary transition hover:border-primary"
                  onClick={() => navigate("/profile")}
                  type="button"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1a3a6b_0%,#2a5d87_100%)] text-sm font-semibold text-white">
                    {user?.name?.slice(0, 1)}
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-sm font-semibold">{user?.name}</span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted">{user?.role}</span>
                  </span>
                </button>

                <button
                  className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(26,58,107,0.24)] transition hover:bg-[#24477a]"
                  onClick={() => logoutMutation.mutate(undefined, { onSuccess: () => navigate("/login") })}
                  type="button"
                >
                  {t("logout")}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-[#e9d7c2] pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">{t("welcome")}</p>
                <h1 className="text-xl font-semibold text-secondary">{activeItem?.label || t("dashboard")}</h1>
              </div>

              <nav className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {navItems.slice(0, 6).map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                        isActive
                          ? "border-primary bg-primary text-white shadow-[0_10px_20px_rgba(216,90,48,0.24)]"
                          : "border-[#e2c9af] bg-white/80 text-secondary hover:border-primary/60 hover:text-primary"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 xl:flex-row">
          <aside
            className={clsx(
              "rounded-[2rem] border border-[#e3c8a9] bg-[linear-gradient(180deg,#fffaf4_0%,#f5e8d7_100%)] p-4 shadow-[0_18px_48px_rgba(86,53,22,0.1)] transition-all",
              collapsed ? "xl:w-28" : "xl:w-80"
            )}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              {!collapsed && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">{t("navigation")}</p>
                  <p className="mt-1 text-sm text-muted">{t("appSubtitle")}</p>
                </div>
              )}

              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9b792] bg-white text-secondary transition hover:border-primary hover:text-primary"
                onClick={() => setCollapsed((value) => !value)}
                type="button"
              >
                <MenuIcon />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      "group flex items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-sm font-medium transition",
                      isActive
                        ? "border-primary/10 bg-[linear-gradient(135deg,#d85a30_0%,#ee8f54_100%)] text-white shadow-[0_14px_28px_rgba(216,90,48,0.24)]"
                        : "border-transparent bg-white/70 text-secondary hover:border-[#efcfaa] hover:bg-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={clsx(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[11px] font-bold tracking-[0.18em]",
                          isActive ? "bg-white/18 text-white" : "bg-primary/10 text-primary"
                        )}
                      >
                        {item.shortLabel}
                      </span>
                      {!collapsed && (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="truncate">{item.label}</span>
                          <span className={clsx("h-2.5 w-2.5 rounded-full", isActive ? "bg-white" : "bg-[#f0c18c] group-hover:bg-primary")} />
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <main className="rounded-[2rem] border border-[#ead7c4] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,249,242,0.96)_100%)] p-4 shadow-[0_20px_60px_rgba(78,52,26,0.08)] sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
