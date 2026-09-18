"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * layout.tsx is a server component, so next-themes (which needs hooks and
 * localStorage) is isolated behind this client boundary.
 *
 * attribute="data-theme"  -> writes data-theme="light" | "dark" on <html>,
 *                            which is what theme.scss keys off.
 * defaultTheme="system"   -> the "device" option; follows the OS setting.
 * enableSystem            -> keeps listening to prefers-color-scheme changes
 *                            live, so the site flips when the OS does.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}