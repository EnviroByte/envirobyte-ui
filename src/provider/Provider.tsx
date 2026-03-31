import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export interface ProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
}

export function Provider({ children, defaultTheme = "light" }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
      {children}
    </ThemeProvider>
  );
}
