"use client";

import { useEffect, useState } from "react";

/**
 * The keyboard shortcut label for the command palette, written the way the viewer's
 * own keyboard writes it.
 *
 * It was hardcoded to `⌘K`, which is Mac notation — on Windows the palette answers to
 * Ctrl+K, so the badge was both unrecognisable and wrong. A client reviewing on Windows
 * asked what the symbol was (2026-08-21).
 *
 * Returns `undefined` until mounted so the server and the first client render agree;
 * the caller renders no badge for that one frame.
 */
export function useShortcutLabel(explicit?: string): string | undefined {
  const [label, setLabel] = useState<string | undefined>(explicit);

  useEffect(() => {
    if (explicit !== undefined) {
      setLabel(explicit);
      return;
    }
    setLabel(isApplePlatform() ? "⌘K" : "Ctrl K");
  }, [explicit]);

  return label;
}

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const platform = data?.platform ?? navigator.platform ?? navigator.userAgent ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}
