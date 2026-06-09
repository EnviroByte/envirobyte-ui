"use client";

import { cn } from "../../../lib/utils";
import { APP_HUB_ICON_SVGS, type AppHubAppId } from "./appHubIcons";

export interface AppHubIconProps {
  appId: AppHubAppId;
  className?: string;
}

/** Inline SVG so `fill="currentColor"` follows the hub text color. */
export function AppHubIcon({ appId, className }: AppHubIconProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center text-slate-500 dark:text-slate-400 [&>svg]:block [&>svg]:h-full [&>svg]:w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: APP_HUB_ICON_SVGS[appId] }}
      aria-hidden
    />
  );
}
