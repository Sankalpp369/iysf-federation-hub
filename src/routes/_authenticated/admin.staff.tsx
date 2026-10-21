import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { listStaff, inviteStaff, removeStaff } from "@/lib/cms.functions";
import { IYSF } from "../../components/site-chrome";

export const Route = createFileRoute("/_authenticated/admin/staff")({ component: StaffPage });

function StaffPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function invite(e: FormEvent) {
    e.preventDefault();
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) { toast.error("Enter a valid email address"); return; }
    setBusy(true);
    try {
      const r = await inviteStaff({ data: { email: parsed.data, origin: window.location.origin } });
      toast.success(r.existing ? "Access granted — a password link was emailed." : "Invitation sent.");
      setEmail("");
      void qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed");
    } finally { setBusy(false); }
  }

  async function remove(id: string, mail: string) {
    if (!confirm(`Remove staff access for ${mail}?`)) return;
    try {
      await removeStaff({ data: { userId: id } });
      toast.success("Access removed");
      void qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove access");
    }
  }

  const count = data?.staff.length ?? 0;
  return (
    <div className="max-w-[760px]">
      <h1 className="text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>Staff</h1>
      <form onSubmit={invite} className="mt-5 flex flex-col gap-2 rounded-xl border bg-white p-4 sm:flex-row" style={{ borderColor: IYSF.blueLine }}>
        <label htmlFor="invite-email" className="sr-only">Email to invite</label>
        <input id="invite-email" type="email" required placeholder="name@example.org" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 flex-1 rounded-md border px-3 text-sm" style={{ borderColor: IYSF.blueLine }} />
        <button type="submit" disabled={busy} className="min-h-11 rounded-[10px] px-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: IYSF.magenta }}>{busy ? "Sending…" : "Invite staff"}</button>
      </form>
      {error && <p role="alert" className="mt-4 text-sm" style={{ color: IYSF.magenta }}>Couldn't load staff: {error instanceof Error ? error.message : "check your access and server configuration."}</p>}
      <ul className="mt-5 space-y-2">
        {isLoading && Array.from({ length: 2 }).map((_, i) => <li key={i} className="h-16 animate-pulse rounded-xl bg-black/5" />)}
        {data?.staff.map((s) => {
          const self = s.id === data.me;
          const locked = self || count <= 1;
          return (
            <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4" style={{ borderColor: IYSF.blueLine }}>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{s.email}{self && <span className="ml-2 text-xs opacity-60">(you)</span>}</div>
                <div className="text-xs opacity-70">{s.confirmed ? "Active" : "Invitation pending"}</div>
              </div>
              <button type="button" disabled={locked} onClick={() => remove(s.id, s.email)} title={self ? "You can't remove yourself" : count <= 1 ? "Last staff member" : undefined}
                className="min-h-10 rounded-md border px-3 text-sm font-semibold disabled:opacity-40" style={{ borderColor: IYSF.magenta, color: IYSF.magenta }}>
                Remove access
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
