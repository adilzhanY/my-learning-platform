"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

interface SavedCompanionsContextValue {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedCompanionsContext = createContext<SavedCompanionsContextValue | undefined>(undefined);

const STORAGE_KEY = "saved_companions_v1";

export const SavedCompanionsProvider = ({ children }: { children: ReactNode }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load from localStorage once on mount (client only)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedIds(parsed.filter((v) => typeof v === 'string'));
      }
    } catch (err) {
      console.warn("Failed to parse saved companions", err);
    }
  }, []);

  // Persist when list changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
      }
    } catch (err) {
      console.warn("Failed to persist saved companions", err);
    }
  }, [savedIds]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const value: SavedCompanionsContextValue = { savedIds, toggleSave, isSaved };

  return <SavedCompanionsContext.Provider value={value}>{children}</SavedCompanionsContext.Provider>;
};

export const useSavedCompanions = () => {
  const ctx = useContext(SavedCompanionsContext);
  if (!ctx) throw new Error("useSavedCompanions must be used within a SavedCompanionsProvider");
  return ctx;
};
