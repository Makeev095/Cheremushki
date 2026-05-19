import type { ReactNode } from "react";

/**
 * Светлая «подложка» для внутренних страниц: текст не сливается с фоновым фото.
 */
export function InnerPageSurface({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-md ring-1 ring-black/[0.04] backdrop-blur-md sm:p-8 md:p-10">
      {children}
    </div>
  );
}
