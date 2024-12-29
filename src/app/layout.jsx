"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/react";

import "@/styles/globals.css";
import { useContextMenu } from "@/hooks/useContextMenu";
import { usePreventBrowserShortcuts } from "@/hooks/usePreventBrowserShortcuts";

export default function RootLayout({ children }) {
  useContextMenu();
  usePreventBrowserShortcuts();

  return (
    <html lang="en" className="dark">
      <body className="antialiased select-none">
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
