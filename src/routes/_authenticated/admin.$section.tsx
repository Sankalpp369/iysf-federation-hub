import { createFileRoute, Link } from "@tanstack/react-router";
import { IYSF } from "../../components/site-chrome";
import { ADMIN_NAV } from "./admin";
import { SectionManager } from "../../components/admin/section-manager";

export const Route = createFileRoute("/_authenticated/admin/$section")({ component: Soon });

function Soon() {
  const { section } = Route.useParams();
  const item = ADMIN_NAV.find((n) => n.to === `/admin/${section}`);
  if (["events", "rules", "results", "officials", "homepage", "applications"].includes(section)) {
    return <SectionManager section={section as "events" | "rules" | "results" | "officials" | "homepage" | "applications"} />;
  }
  return (
    <div className="rounded-xl border bg-white p-8 text-center" style={{ borderColor: IYSF.blueLine }}>
      <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{item?.label ?? "Not found"}</h1>
      <p className="mt-2 text-sm">{item ? "This section is coming soon." : "This admin page doesn't exist."}</p>
      <Link to="/admin" className="mt-4 inline-block text-sm font-semibold underline" style={{ color: IYSF.magenta }}>Back to dashboard</Link>
    </div>
  );
}
