"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy load non-critical components after initial hydration & idle time
// so their chunks never compete with First Contentful Paint or Largest Contentful Paint
const Toaster = dynamic(() => import("@/components/Toaster").then(mod => ({ default: mod.Toaster })), {
  ssr: false,
  loading: () => null,
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
  const [idleReady, setIdleReady] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const activate = () => setIdleReady(true);

    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(activate, { timeout: 1500 });
    } else {
      timerId = setTimeout(activate, 250);
    }

    return () => {
      if (idleId !== null && typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };
  }, []);

  if (!idleReady) {
    return null;
  }

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








