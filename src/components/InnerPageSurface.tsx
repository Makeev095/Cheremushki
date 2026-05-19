import type { ReactNode } from "react";

/**
 * Светлая «подложка» для внутренних страниц: текст не сливается с фоновым фото.
 */
export function InnerPageSurface({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-md ring-1 ring-black/[0.04] backdrop-blur-md sm:rounded-3xl sm:p-8 md:p-10">
      {children}
    </div>
  );
}
