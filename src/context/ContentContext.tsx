import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  EditsSection,
  MemorySection,
  ProposalSection,
  ProfileSection,
  ScreenKey,
} from "../types/content";
import {
  getStoredToken,
  clearStoredToken,
  unlockSanctuary,
  fetchProfile,
  fetchEditsScreen,
  fetchMemoryScreen,
  fetchProposalScreen,
} from "../api/client";

interface ContentContextType {
  isAuthenticated: boolean;
  editsData: EditsSection | null;
  memoryData: MemorySection | null;
  proposalData: ProposalSection | null;
  profileData: ProfileSection | null;
  loadingScreen: ScreenKey | "unlock" | null;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  loadProfile: () => Promise<void>;
  loadEdits: () => Promise<void>;
  loadMemory: () => Promise<void>;
  loadProposal: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(!!getStoredToken());
  const [editsData, setEditsData] = useState<EditsSection | null>(null);
  const [memoryData, setMemoryData] = useState<MemorySection | null>(null);
  const [proposalData, setProposalData] = useState<ProposalSection | null>(
    null,
  );
  const [profileData, setProfileData] = useState<ProfileSection | null>(null);
  const [loadingScreen, setLoadingScreen] = useState<
    ScreenKey | "unlock" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  /** A 401 anywhere means the session died — drop everything and re-lock. */
  const handleFailure = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    setError(message);
    if (message.includes("Session expired") || message.includes("Unauthorized")) {
      clearStoredToken();
      setIsAuthenticated(false);
      setEditsData(null);
      setMemoryData(null);
      setProposalData(null);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    setLoadingScreen("unlock");
    try {
      await unlockSanctuary(password);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid password");
      return false;
    } finally {
      setLoadingScreen(null);
    }
  };

  const logout = useCallback(() => {
    clearStoredToken();
    setIsAuthenticated(false);
    setEditsData(null);
    setMemoryData(null);
    setProposalData(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  /** Public route — fetch once so the picker can show her face immediately. */
  const loadProfile = useCallback(async () => {
    if (profileData) return;
    const data = await fetchProfile();
    setProfileData(data);
  }, [profileData]);

  const loadEdits = useCallback(async () => {
    if (editsData) return; // Already cached in memory!
    setError(null);
    try {
      const data = await fetchEditsScreen();
      setEditsData(data);
    } catch (err) {
      handleFailure(err);
    }
  }, [editsData, handleFailure]);

  const loadMemory = useCallback(async () => {
    if (memoryData) return;
    setError(null);
    try {
      const data = await fetchMemoryScreen();
      setMemoryData(data);
    } catch (err) {
      handleFailure(err);
    }
  }, [memoryData, handleFailure]);

  const loadProposal = useCallback(async () => {
    if (proposalData) return;
    setError(null);
    try {
      const data = await fetchProposalScreen();
      setProposalData(data);
    } catch (err) {
      handleFailure(err);
    }
  }, [proposalData, handleFailure]);

  return (
    <ContentContext.Provider
      value={{
        isAuthenticated,
        editsData,
        memoryData,
        proposalData,
        profileData,
        loadingScreen,
        error,
        login,
        logout,
        clearError,
        loadProfile,
        loadEdits,
        loadMemory,
        loadProposal,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
