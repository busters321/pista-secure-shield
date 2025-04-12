
import { useState, useEffect } from "react";
import { Menu, X, Shield, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  {
    label: "Tools",
    children: [
      { label: "Scam Intelligence", href: "#scam-intelligence" },
      { label: "Link Inspector", href: "#" },
      { label: "Email Scanner", href: "#" },
      { label: "Cyber Copilot", href: "#" },
      { label: "SafeView Browser", href: "#" },
    ],
  },
  {
    label: "Features",
    children: [
      { label: "Social Media Protection", href: "#" },
      { label: "Password Risk Checker", href: "#" },
      { label: "Scam Report Generator", href: "#" },
      { label: "Live Threat Feed", href: "#" },
    ],
  },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem("pistaSecure_isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLogin = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("pistaSecure_isLoggedIn");
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Shield className="h-7 w-7 text-pistachio" />
          <span className="text-xl font-bold">
            Pista<span className="text-pistachio">Secure</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            item.children ? (
              <div className="relative" key={item.label}>
                <button
                  className="flex items-center gap-1 px-1 py-2 text-sm font-medium hover:text-pistachio focus:outline-none"
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-card shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <div className="p-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="px-1 py-2 text-sm font-medium hover:text-pistachio"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:flex gap-3">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDashboard}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogin}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Button>
                <Button 
                  size="sm" 
                  className="bg-pistachio hover:bg-pistachio-dark text-black"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/90 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="flex w-full items-center justify-between py-2 text-sm font-medium"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block py-2 text-sm hover:text-pistachio"
                            onClick={toggleMenu}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block py-2 text-sm font-medium hover:text-pistachio"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              {isLoggedIn ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => {
                      toggleMenu();
                      handleDashboard();
                    }}
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2 bg-pistachio hover:bg-pistachio-dark text-black"
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      toggleMenu();
                      handleLogin();
                    }}
                  >
                    Log in
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                    onClick={() => {
                      toggleMenu();
                      navigate("/signup");
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
