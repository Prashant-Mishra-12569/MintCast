import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-secondary/95 backdrop-blur-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        <div className="text-2xl font-bold gradient-text">MinterCast</div>
        
        <div className="hidden md:flex items-center gap-8">
          {["home", "about", "mint"].map((section) => (
            <Button
              key={section}
              variant="ghost"
              className="text-white hover:text-primary capitalize"
              onClick={() => scrollToSection(section)}
            >
              {section}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};