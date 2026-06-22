/**
 * Small presentational helpers shared across admin pages. Server-safe (no
 * client hooks). Keeps the stub pages DRY and visually consistent with the
 * prototype (prototype/admin.html).
 */
import type { ReactNode } from "react";

export function AdminTopbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-fo-line bg-white px-8 py-6 max-[860px]:px-4">
      <div>
        <h1 className="mb-0.5 text-[1.6rem]">{title}</h1>
        {subtitle ? (
          <span className="text-[0.9rem] text-fo-muted">{subtitle}</span>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminContent({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="px-8 py-8 max-[860px]:px-4">
      {children}
    </main>
  );
}

export function AdminSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      {title ? <h2 className="mb-4 text-[1.2rem]">{title}</h2> : null}
      {children}
    </section>
  );
}

/** "Coming soon" placeholder card for stub management pages. */
export function ComingSoonCard({
  message = "Management UI coming soon.",
}: {
  message?: string;
}) {
  return (
    <div className="max-w-[640px] rounded-card border border-fo-line bg-white p-6">
      <p className="text-[0.9rem] text-fo-muted">{message}</p>
    </div>
  );
}

/** Simple bordered table wrapper used by list pages. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-fo-line bg-white">
      <table className="w-full border-collapse text-left text-[0.9rem]">
        {children}
      </table>
    </div>
  );
}

export const thClass =
  "border-b border-fo-line px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-fo-muted";
export const tdClass = "border-b border-fo-line px-4 py-3 align-top";
export const tabnum = "[font-variant-numeric:tabular-nums]";

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td className={`${tdClass} text-fo-muted`} colSpan={colSpan}>
        {label}
      </td>
    </tr>
  );
}
