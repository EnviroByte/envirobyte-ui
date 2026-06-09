import { createElement } from "react";
import { AppHubIcon } from "./AppHubIcon";
import type { AppHubAppId } from "./appHubIcons";
import type { AppHubApp } from "./AppHubDropdown";

export interface AppHubAppDefinition {
  id: AppHubAppId;
  label: string;
  defaultHref: string;
}

export const APP_HUB_DEFINITIONS: AppHubAppDefinition[] = [
  {
    id: "emissionx",
    label: "EmissionX",
    defaultHref: "https://emissionx.envirobyte.com",
  },
  {
    id: "atmosiq",
    label: "AtmosIQ",
    defaultHref: "https://atmosiq.envirobyte.com",
  },
  {
    id: "rim",
    label: "RIM",
    defaultHref: "https://rim.envirobyte.com",
  },
  {
    id: "datapivot",
    label: "DataPivot",
    defaultHref: "https://datapivot.envirobyte.com",
  },
  {
    id: "openpems",
    label: "OpenPEMS",
    defaultHref: "#",
  },
];

export interface GetAppHubAppsOptions {
  /** Hide the app the user is currently in. */
  currentApp?: AppHubAppId;
  /** Override default hrefs (e.g. `"#"` for the active product). */
  hrefOverrides?: Partial<Record<AppHubAppId, string>>;
}

export function getAppHubApps(options: GetAppHubAppsOptions = {}): AppHubApp[] {
  const { currentApp, hrefOverrides = {} } = options;

  return APP_HUB_DEFINITIONS.filter((app) => app.id !== currentApp).map(
    (app) => ({
      id: app.id,
      label: app.label,
      href: hrefOverrides[app.id] ?? app.defaultHref,
      icon: createElement(AppHubIcon, { appId: app.id }),
    })
  );
}

export function resolveAppHubApps(
  apps: AppHubApp[] | undefined,
  currentApp: AppHubAppId | undefined,
  hrefOverrides?: Partial<Record<AppHubAppId, string>>
): AppHubApp[] {
  const resolved =
    apps ?? getAppHubApps({ currentApp, hrefOverrides }) ?? [];

  if (!currentApp || apps == null) {
    return resolved;
  }

  return resolved.filter((app) => app.id !== currentApp);
}

export function getAppHubColumns(appCount: number): 2 | 3 {
  return appCount > 4 ? 3 : 2;
}
