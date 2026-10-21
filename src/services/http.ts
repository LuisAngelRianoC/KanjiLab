const API_BASE = 'https://kanjiapi.dev';

/** Wrapper de `fetch` con mensajes de error claros y soporte de timeout. */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`kanjiapi.dev respondió ${response.status} (${response.statusText})`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('La API tardó demasiado en responder. Inténtalo de nuevo.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
