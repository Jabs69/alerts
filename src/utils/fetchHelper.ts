type FetchOptions = RequestInit;

async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP! status: ${response.status} - ${errorText}`);
    }
    const data = await response.json().catch(() => null);

    return data as T;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default apiFetch;