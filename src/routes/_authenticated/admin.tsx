import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, Newspaper, CalendarDays, Trophy, Users, Home, FileText, ShieldCheck, Image, Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { IYSF } from "../../components/site-chrome";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const user = (context as { user: { id: string; email?: string } }).user;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "staff" });
    if (!data) throw redirect({ to: "/login" });
    return { staffEmail: user.email ?? "" };
  },
  head: () => ({ meta: [{ title: "Admin — IYSF" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

export const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, live: true },
  { label: "News", to: "/admin/news", icon: Newspaper, live: true },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Results", to: "/admin/results", icon: Trophy },
  { label: "Officials", to: "/admin/officials", icon: Users },
  { label: "Homepage", to: "/admin/homepage", icon: Home },
  { label: "Membership applications", to: "/admin/applications", icon: FileText },
  { label: "Staff", to: "/admin/staff", icon: ShieldCheck, live: true },
  { label: "Media", to: "/admin/media", icon: Image, live: true },
] as const;

function NavList({ onDone }: { onDone?: () => void }) {
  return (
    <ul className="space-y-1">
      {ADMIN_NAV.map((n) => (
        <li key={n.to}>
          <Link
            to={n.to}
            onClick={onDone}
            activeOptions={{ exact: n.to === "/admin" }}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold hover:bg-black/5"
            activeProps={{ style: { background: IYSF.blueWash, color: IYSF.blue } }}
          >
            <n.icon size={18} aria-hidden="true" />
            <span className="flex-1">{n.label}</span>
            {!("live" in n) && <span className="text-[10px] uppercase tracking-wider opacity-60">Soon</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AdminLayout() {
  const { staffEmail } = Route.useRouteContext();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-dvh bg-[#FAFAFA]" style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal }}>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-white px-3 md:px-5" style={{ borderColor: IYSF.blueLine }}>
        <button type="button" className="rounded-md p-2 md:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>
        <Link to="/admin" className="font-extrabold" style={{ fontFamily: "var(--font-display)", color: IYSF.blue }}>IYSF Admin</Link>
        <Link to="/" className="hidden text-xs font-semibold hover:underline sm:inline" style={{ color: IYSF.magenta }}>View site</Link>
        <span className="ml-auto min-w-0 truncate text-xs sm:text-sm">{staffEmail}</span>
        <button type="button" onClick={signOut} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border px-2.5 text-sm font-semibold" style={{ borderColor: IYSF.blueLine }}>
          <LogOut size={16} aria-hidden="true" /> <span className="max-sm:sr-only">Log out</span>
        </button>
      </header>
      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r bg-white p-3 md:block" style={{ borderColor: IYSF.blueLine }}>
          <nav aria-label="Admin"><NavList /></nav>
        </aside>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
            <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
            <nav className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-3">
              <div className="mb-2 flex justify-end">
                <button type="button" className="rounded-md p-2" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button>
              </div>
              <NavList onDone={() => setOpen(false)} />
            </nav>
          </div>
        )}
        <main className="min-w-0 flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
