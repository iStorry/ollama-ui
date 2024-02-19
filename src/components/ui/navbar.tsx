import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { ThemeSwitcher } from "y/components/ui/theme-switcher";
import { Icons } from "./icons";

export function OllamaNavbar() {
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Icons.partypopper className="mr-2 h-5 w-5" />
          Ollama
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
}
