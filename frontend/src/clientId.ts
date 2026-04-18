const STORAGE_KEY = "music_map_client_id";

function fallbackClientId(): string {
  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getClientId(): string {
  let clientId = localStorage.getItem(STORAGE_KEY);

  if (!clientId) {
    clientId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : fallbackClientId();

    localStorage.setItem(STORAGE_KEY, clientId);
  }

  return clientId;
}

