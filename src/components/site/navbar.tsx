import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Radar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#platform", label: "Platform" },
  { href: "#process", label: "Process" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-5 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-glow-primary">
            <Radar className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
            RetainIQ
          </span>
          <span className="hidden rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground sm:block">
            v1.0
          </span>
        </a>

        {/* Links */}
        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="transition-transform duration-200 hover:scale-105"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Button>
          <Button
            asChild
            className="h-9 bg-gradient-primary px-4 text-primary-foreground shadow-glow-primary transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-primary-lg"
          >
            <a href="#cta">Book a demo</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
