
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Search, Library, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Search", path: "/search", icon: Search },
  { name: "Library", path: "/library", icon: Library },
];

export function NavBar() {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16">
      <div className="w-full h-full backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center"
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute h-3 w-1 bg-white rounded-full left-2"
              ></motion.span>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                className="absolute h-5 w-1 bg-white rounded-full left-4"
              ></motion.span>
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.4 }}
                className="absolute h-4 w-1 bg-white rounded-full left-6"
              ></motion.span>
            </motion.div>
            <span className="font-bold text-xl">FeelGroove</span>
          </Link>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "relative px-4",
                    location.pathname === item.path && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
          
          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-full rounded-none flex flex-col gap-1 items-center justify-center",
                  location.pathname === item.path && "text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
