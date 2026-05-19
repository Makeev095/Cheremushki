export function ReadingsClosedNotice() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-amber-50/80 p-6 shadow-md ring-1 ring-amber-900/10 sm:p-8"
      role="alert"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-200/40 blur-2xl" aria-hidden />
      <div className="relative flex gap-4">
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-white shadow-sm"
          aria-hidden
        >
          !
        </span>
        <div className="min-w-0 space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wide text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-4 sm:text-xl">
            Внимание!
          </h2>
          <p className="text-base leading-relaxed text-amber-950/95 sm:text-[1.05rem]">
            Показания индивидуальных приборов учёта коммунальных услуг {" "}
            <strong className="font-semibold text-amber-950 underline decoration-amber-300 decoration-2 underline-offset-2">

            </strong>{" "}
            предоставляются собственниками{" "}
            <strong className="font-semibold text-amber-950">
              в период с 20 по 24 число (включительно) каждого месяца
            </strong>{" "}
            {" "}
            <strong className="font-semibold text-amber-950 underline decoration-amber-300 decoration-2 underline-offset-2">
              
            </strong>{" "}.
          </p>
          <p className="text-sm leading-relaxed text-amber-900/85">
            
          </p>
        </div>
      </div>
    </div>
  );
}
