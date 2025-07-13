'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslations } from '@/components/language-provider';
import LanguageSwitcher from '@/components/language-switcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-foreground flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                Cyqle
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`dark:text-gray-300 ${isScrolled && theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors`}
            >
              {t('navbar.features')}
            </a>
            <a
              href="#"
              className={`dark:text-gray-300 ${isScrolled && theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors`}
            >
              {t('navbar.useCases')}
            </a>
            <a
              href="#"
              className={`dark:text-gray-300 ${isScrolled && theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors`}
            >
              {t('navbar.pricing')}
            </a>
            <a
              href="/pitch.html"
              className={`dark:text-gray-300 ${isScrolled && theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors`}
            >
              {t('navbar.about')}
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {/* <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> */}
            {/*   {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className={`h-5 w-5 ${isScrolled && "text-gray-300"}`} />} */}
            {/* </Button> */}
            <Button
              disabled
              variant="ghost"
              className={`dark:text-gray-300 hover:text-foreground ${isScrolled && theme !== 'dark' ? 'text-white' : 'text-gray-500'}`}
            >
              {t('navbar.signIn')}
            </Button>
            <Button
              disabled
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {t('navbar.getStarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <LanguageSwitcher />
            {/* <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> */}
            {/*   {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className={`h-5 w-5 ${isScrolled && "text-gray-300"}`} />} */}
            {/* </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled && 'text-gray-300'}`} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className={`dark:text-gray-300 ${theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors py-2`}
              >
                {t('navbar.features')}
              </a>
              <a
                href="#"
                className={`dark:text-gray-300 ${theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors py-2`}
              >
                {t('navbar.useCases')}
              </a>
              <a
                href="#"
                className={`dark:text-gray-300 ${theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors py-2`}
              >
                {t('navbar.pricing')}
              </a>
              <a
                href="#"
                className={`dark:text-gray-300 ${theme !== 'dark' ? 'text-white' : 'text-gray-500'} hover:opacity-75 transition-colors py-2`}
              >
                {t('navbar.about')}
              </a>
              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="w-full justify-center">
                  {t('navbar.signIn')}
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  {t('navbar.getStarted')}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
