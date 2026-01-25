'use client';

import { useTranslations } from '@/components/language-provider';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale || 'en';
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-gray-950 pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="col-span-1">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-white flex items-center gap-3 mb-6"
            >
              <img
                src="/logo-mid.png"
                alt="Cyqle Logo"
                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 object-contain"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-200 to-slate-300">
                Cyqle
              </span>
            </Link>
            <p className="text-gray-400 mb-6">{t('footer.description')}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.company.title')}</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.company.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms-of-service`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.company.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cookies`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright', { year: year.toString() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
