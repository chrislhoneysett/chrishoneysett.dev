"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from '@/components/Icon'
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";
const storageKey = "theme";
const changeEvent = "site-theme-change";
let unsavedTheme: Theme | null = null;

function getTheme(): Theme {
  if (unsavedTheme) return unsavedTheme;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private browsing may disable storage; the switch still works for this visit.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = () => {
    unsavedTheme = null;
    notify();
  };

  window.addEventListener(changeEvent, notify);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", notify);

  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", notify);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(storageKey, next);
      unsavedTheme = null;
    } catch {
      unsavedTheme = next;
    }
    window.dispatchEvent(new Event(changeEvent));
  }

  return (
    <button type="button" className={styles.toggle} onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
      <Icon name={theme === "dark" ? 'light-mode' : 'dark-mode'} className={styles.icon} />
      <span className={styles.label}>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
