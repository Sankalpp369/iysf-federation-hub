import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function useMobileMore() {
  const [open, setOpen] = useState(false);
  const hide = (i: number, keep: number) => (!open && i >= keep ? "max-sm:hidden" : "");
  return { open, setOpen, hide };
}

export function MobileMoreButton({
  open,
  onToggle,
  more,
  less = "Show less",
}: {
  open: boolean;
  onToggle: () => void;
  more: string;
  less?: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[14px] font-bold sm:hidden"
      style={{ borderColor: "rgba(66,152,211,0.5)", color: "#414042" }}
    >
      {open ? less : more}
      <ChevronDown size={16} aria-hidden="true" className={open ? "rotate-180" : ""} />
    </button>
  );
}

export function MobileCollapse({
  label,
  openLabel,
  children,
}: {
  label: string;
  openLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.08em] sm:hidden"
        style={{ color: "#DE007A" }}
      >
        {open ? openLabel ?? "Hide" : label}
        <ChevronDown size={14} aria-hidden="true" className={open ? "rotate-180" : ""} />
      </button>
      <div className={open ? "" : "max-sm:hidden"}>{children}</div>
    </>
  );
}
