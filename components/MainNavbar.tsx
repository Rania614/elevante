"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function MainNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 py-2 sm:py-3 shadow-lg transition-colors duration-300 ${isNavbarScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <a href="#hero" className="text-2xl font-extrabold shrink-0" onClick={e => { e.preventDefault(); scrollToSection('#hero'); }}>
          <img
            src={isNavbarScrolled ? "/logoname2.png" : "/namelogo.png"}
            alt="Elevante Logo"
            className="h-8 sm:h-9"
          />
        </a>
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-4 xl:space-x-6 text-[#1D3557] mx-12">
          {/* ... باقي الروابط ... */}
        </nav>
        <div className="hidden lg:flex space-x-4 shrink-0">
          <a href="/login" className="nav-button bg-transparent text-[#1D3557] hover:bg-[#1D3557] hover:text-white transition duration-300">Login</a>
          <a href="/register" className="nav-button bg-transparent text-[#1D3557] hover:bg-[#1D3557] hover:text-white transition duration-300">Register</a>
        </div>
        <div className="lg:hidden ml-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`focus:outline-none mobile-menu-icon ${isNavbarScrolled ? 'text-white' : 'text-[#1D3557]'}`}
          >
            <Menu className="text-xl" />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden px-4 pt-2 pb-4 space-y-1">
          {/* ... باقي الروابط ... */}
          <a href="/login" className="block nav-button bg-transparent text-center mt-4">Login</a>
          <a href="/register" className="block nav-button bg-[#457B9D] text-white text-center mt-2">Register</a>
        </div>
      )}
    </header>
  );
}