import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, Heart, Moon, Sun, User } from "lucide-react";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
}

export function Header({ onSearchChange, searchValue }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { getCartCount, setIsCartOpen, wishlistCount } = useCart();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "1";

  // Inicializar dark mode desde localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Sobre Nosotros", href: "/about" },
    { name: "Dr Fragancia", href: "/recommender" },
    { name: "Lista de deseos", href: "/favorites" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border dark:bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-foreground text-xl font-light">✦</span>
            </div>
            <span className="text-2xl font-light tracking-wider text-primary">
              ZEST PARFUMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm tracking-wide text-foreground hover:text-primary transition-colors font-light"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 bg-input-background dark:bg-muted rounded-full px-4 py-2 w-64 border border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar perfumes..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-muted dark:hover:bg-muted rounded-full transition-colors hidden md:flex items-center justify-center"
              title="Cambiar tema"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Icons */}
            {token ? (
  isAdmin ? (
    <>
      <Link
        to="/dashboard"
        className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-background dark:bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted dark:hover:bg-muted transition-colors"
      >
        Mi cuenta
      </Link>

      <Link
        to="/admin"
        className="hidden md:inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
      >
        Admin
      </Link>
    </>
  ) : (
    <Link
      to="/dashboard"
      className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-background dark:bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted dark:hover:bg-muted transition-colors"
    >
      Mi cuenta
    </Link>
  )
) : (
  <Link
    to="/login"
    className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-background dark:bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted dark:hover:bg-muted transition-colors"
  >
    Iniciar sesión
  </Link>
)}
            <Link
              to="/favorites"
              className="relative p-2 hover:bg-muted dark:hover:bg-muted rounded-full transition-colors hidden md:inline-flex"
            >
              <Heart className="w-5 h-5 text-foreground" />
              {wishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {wishlistCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-muted dark:hover:bg-muted rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted dark:hover:bg-muted rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="flex items-center gap-2 bg-input-background dark:bg-muted rounded-full px-4 py-2 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar perfumes..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm tracking-wide text-foreground hover:text-primary transition-colors font-light"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-4 pt-4 border-t border-border">
                <button className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  Cuenta
                </button>
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Favoritos
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors ml-auto"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  Tema
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
