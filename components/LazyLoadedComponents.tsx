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
    let activated = false;

    const interactionEvents = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
      "tool:settings-toggle",
    ] as const;

    const cleanupListeners = () => {
      for (const evt of interactionEvents) {
        window.removeEventListener(evt, activate);
      }
    };

    function activate() {
      if (activated) return;
      activated = true;
      cleanupListeners();
      if (idleId !== null && typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      setIdleReady(true);
    }

    for (const evt of interactionEvents) {
      window.addEventListener(evt, activate, { once: true, passive: true });
    }

    timerId = setTimeout(() => {
      if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(activate, { timeout: 2000 });
      } else {
        activate();
      }
    }, 5500);

    return () => {
      cleanupListeners();
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








