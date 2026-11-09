import React, { useCallback, useEffect, useState } from "react";
import { ContentProvider, useContent } from "./context/ContentContext";
import { ToastProvider } from "./components/common/Toast";
import { Ambient } from "./components/common/Ambient";
import { BottomNav } from "./components/common/BottomNav";
import { TopBar } from "./components/common/TopBar";
import { ProfileSelect } from "./components/auth/ProfileSelect";
import { PasswordModal } from "./components/auth/PasswordModal";
import { BootSequence } from "./components/auth/BootSequence";
import { EditsPage } from "./pages/EditsPage";
import { MemoryPage } from "./pages/MemoryPage";
import { ProposalPage } from "./pages/ProposalPage";
import { wakeUpServer } from "./api/client";
import type { ScreenKey } from "./types/content";

/** select_profile → password popup → boot sequence → app */
type Stage = "profiles" | "password" | "booting" | "app";

const Shell: React.FC = () => {
  const { isAuthenticated, logout, editsData, profileData, loadProfile, loadEdits } =
    useContent();
  const [stage, setStage] = useState<Stage>("profiles");
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("edits");

  // Warm the API (and the hero frame) while she is still deciding
  useEffect(() => {
    wakeUpServer();
    loadProfile();
    if (isAuthenticated) loadEdits();
  }, [isAuthenticated, loadProfile, loadEdits]);

  // A dead session always sends her back to the profile picker
  useEffect(() => {
    if (!isAuthenticated && stage === "app") {
      setStage("profiles");
      setActiveScreen("edits");
    }
  }, [isAuthenticated, stage]);

  const handleUnlocked = useCallback(() => setStage("booting"), []);
  const handleBootDone = useCallback(() => setStage("app"), []);

  const handleLogout = useCallback(() => {
    logout();
    setStage("profiles");
    setActiveScreen("edits");
  }, [logout]);

  const selectScreen = useCallback((screen: ScreenKey) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (stage === "profiles") {
    return (
      <ProfileSelect
        heroImage={editsData?.hero.heroImageUrl}
        herAvatarUrl={profileData?.herAvatarUrl}
        onPick={() => setStage("password")}
      />
    );
  }

  return (
    <>
      {stage !== "app" && <Ambient intensity="soft" />}

      {stage === "app" && (
        <div className="relative isolate min-h-screen pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
          <TopBar
            activeScreen={activeScreen}
            onSelectScreen={selectScreen}
            onLogout={handleLogout}
          />

          <main key={activeScreen} className="animate-fade-in">
            {activeScreen === "edits" && <EditsPage />}
            {activeScreen === "memory" && <MemoryPage onGoNext={() => selectScreen("proposal")} />}
            {activeScreen === "proposal" && <ProposalPage />}
          </main>

          <BottomNav activeScreen={activeScreen} onSelectScreen={selectScreen} />
        </div>
      )}

      {stage === "password" && (
        <PasswordModal
          onClose={() => setStage("profiles")}
          onUnlocked={handleUnlocked}
        />
      )}

      {stage === "booting" && <BootSequence onDone={handleBootDone} />}
    </>
  );
};

export const App: React.FC = () => (
  <ContentProvider>
    <ToastProvider>
      <Shell />
    </ToastProvider>
  </ContentProvider>
);

export default App;
