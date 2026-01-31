"use client";

import dynamic from "next/dynamic";

// Lazy load non-critical components to reduce initial bundle size
// These components don't need to be in the initial bundle
const Toaster = dynamic(() => import("@/components/Toaster").then(mod => ({ default: mod.Toaster })), {
  ssr: false,
  loading: () => null, // Don't show loading state
});

const SettingsPanel = dynamic(() => import("@/components/SettingsPanel").then(mod => ({ default: mod.SettingsPanel })), {
  ssr: false,
  loading: () => null,
});

const AchievementNotificationManager = dynamic(() => import("@/components/AchievementNotification").then(mod => ({ default: mod.AchievementNotificationManager })), {
  ssr: false,
  loading: () => null,
});

const SoundInteractions = dynamic(() => import("@/components/SoundInteractions").then(mod => ({ default: mod.SoundInteractions })), {
  ssr: false,
  loading: () => null,
});

const LevelUpModal = dynamic(() => import("@/components/LevelUpModal").then(mod => ({ default: mod.LevelUpModal })), {
  ssr: false,
  loading: () => null,
});

export function LazyLoadedComponents() {
  return (
    <>
      <SettingsPanel />
      <AchievementNotificationManager />
      <SoundInteractions />
      <LevelUpModal />
      <Toaster />
    </>
  );
}








