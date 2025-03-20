
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-accent/20"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 transition-all duration-500 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 transition-all duration-500 rotate-90 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
