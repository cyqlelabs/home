'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslations } from '@/components/language-provider';
import LanguageSwitcher from '@/components/language-switcher';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  const locale = useLocale();

  const getLink = (id: string) => {
    return `/${locale}#${id}`;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md py-3 shadow-2xl border-b border-white/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-foreground flex items-center gap-3"
            >
              <img
                src="/logo-mid.png"
                alt="Cyqle Logo"
                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 object-contain"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300">
                Cyqle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={getLink('features')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('navbar.features')}
            </Link>
            <Link
              href={getLink('useCases')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('navbar.useCases')}
            </Link>
            <Link
              href={getLink('pricing')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('navbar.pricing')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('navbar.about')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {/* <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> */}
            {/*   {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className={`h-5 w-5 ${isScrolled && "text-gray-300"}`} />} */}
            {/* </Button> */}
            <Button disabled variant="ghost" className="text-slate-300 hover:text-white">
              {t('navbar.signIn')}
            </Button>
            <Button
              disabled
              className="bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 text-slate-800 hover:from-gray-500 hover:via-gray-300 hover:to-gray-500 shadow-lg"
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
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href={getLink('features')}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t('navbar.features')}
              </Link>
              <Link
                href={getLink('useCases')}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t('navbar.useCases')}
              </Link>
              <Link
                href={getLink('pricing')}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t('navbar.pricing')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {t('navbar.about')}
              </Link>
              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="w-full justify-center">
                  {t('navbar.signIn')}
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 text-gray-900 hover:from-gray-500 hover:via-gray-300 hover:to-gray-500 shadow-lg">
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
