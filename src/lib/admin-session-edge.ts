/** Проверка сессии в Edge Middleware (тот же HMAC, что в admin-auth.ts). */
export async function expectedAdminSessionToken(
  secret: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode("readings-admin-v1"),
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminSessionCookie(
  cookieValue: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!secret || !cookieValue) return false;
  const expected = await expectedAdminSessionToken(secret);
  return cookieValue === expected;
}
