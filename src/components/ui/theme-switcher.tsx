"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Icons } from "./icons";

export function ThemeSwitcher() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <>
      <Button isIconOnly aria-label="theme" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Icons.moon className="h-5 w-5" />
        ) : (
          <Icons.sun className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
