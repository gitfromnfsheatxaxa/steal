import PocketBase from "pocketbase";

const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8090";

/**
 * Singleton PocketBase client.
 *
 * On the client side we reuse a single instance so authStore state
 * (JWT + user model) persists across navigations.
 *
 * On the server (SSR / RSC) every request gets a fresh instance
 * because there is no single "user" — the auth token comes from cookies.
 */
function createPocketBase(): PocketBase {
  return new PocketBase(POCKETBASE_URL);
}

let clientInstance: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (typeof window === "undefined") {
    // Server: always fresh
    return createPocketBase();
  }
  // Client: singleton
  if (!clientInstance) {
    clientInstance = createPocketBase();

    // Load auth from cookie on first creation
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith("pb_auth="));
    if (stored) {
      const value = decodeURIComponent(stored.split("=")[1]);
      try {
        const parsed = JSON.parse(value) as { token: string; record: { id: string; collectionId: string; collectionName: string; [key: string]: unknown } };
        clientInstance.authStore.save(parsed.token, parsed.record);
      } catch {
        // Corrupted cookie — ignore
      }
    }

    // Persist auth changes to cookie
    clientInstance.authStore.onChange(() => {
      if (clientInstance?.authStore.isValid) {
        const data = JSON.stringify({
          token: clientInstance.authStore.token,
          record: clientInstance.authStore.record,
        });
        document.cookie = `pb_auth=${encodeURIComponent(data)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      } else {
        document.cookie =
          "pb_auth=; path=/; max-age=0; SameSite=Lax";
      }
    });
  }
  return clientInstance;
}

/**
 * Clear the client singleton (e.g. on logout).
 */
export function clearPocketBase(): void {
  if (clientInstance) {
    clientInstance.authStore.clear();
    clientInstance = null;
  }
  // Also clear cookie
  if (typeof document !== "undefined") {
    document.cookie = "pb_auth=; path=/; max-age=0; SameSite=Lax";
  }
}
