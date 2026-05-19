"use client";

export function AdminLogoutButton() {
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={() => logout()}
      className="rounded-xl border border-emerald-800/30 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
    >
      Выйти
    </button>
  );
}
