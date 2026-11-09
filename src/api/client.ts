import type {
  UnlockResponse,
  EditsSection,
  MemorySection,
  ProposalSection,
  ProfileSection,
} from "../types/content";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const TOKEN_STORAGE_KEY = "sanctuary_access_token";

export const getStoredToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setStoredToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = (): void => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

/** Silent ping to wake up Render's free tier while she is on the password screen */
export const wakeUpServer = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/health`);
  } catch {
    // Ignore errors on silent wake-up ping
  }
};

/** GET /profile - Public; her avatar for the "Who's watching?" picker */
export const fetchProfile = async (): Promise<ProfileSection> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) return {};
    return await response.json();
  } catch {
    // Never block the picker on a cold/sleeping backend
    return {};
  }
};

/** POST /unlock - Verifies password and stores the access token */
export const unlockSanctuary = async (
  password: string,
): Promise<UnlockResponse> => {
  const response = await fetch(`${API_BASE_URL}/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({ detail: "Invalid password" }));
    throw new Error(err.detail || "Invalid access code.");
  }

  const data: UnlockResponse = await response.json();
  setStoredToken(data.accessToken);
  return data;
};

/** Generic helper for authenticated screen GET requests */
async function fetchProtectedScreen<T>(endpoint: string): Promise<T> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Unauthorized: Missing access token");
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    clearStoredToken();
    throw new Error("Session expired. Please re-enter the password.");
  }

  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint} content.`);
  }

  return response.json();
}

export const fetchEditsScreen = () =>
  fetchProtectedScreen<EditsSection>("edits");
export const fetchMemoryScreen = () =>
  fetchProtectedScreen<MemorySection>("memory");
export const fetchProposalScreen = () =>
  fetchProtectedScreen<ProposalSection>("proposal");
