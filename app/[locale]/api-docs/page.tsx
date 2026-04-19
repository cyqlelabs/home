import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { type Metadata } from 'next';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import TrackedLink from '@/components/tracked-link';
import { Badge } from '@/components/ui/badge';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';
import {
  Bot,
  MonitorPlay,
  Code2,
  Camera,
  FileUp,
  Layers,
  Network,
  Terminal,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import BackToTop from './back-to-top';

type Props = {
  params: { locale: string };
};

const DOCS_URL = 'https://api.cyqle.in/docs/';
const BASE_URL = 'https://api.cyqle.in/v1';

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const alternates = getSEOAlternates(locale as SiteLocale, '/api-docs');

  const title =
    locale === 'en'
      ? 'Cyqle API — A Programmable Desktop for AI Agents'
      : 'API de Cyqle — Un Escritorio Programable para Agentes de IA';

  const description =
    locale === 'en'
      ? 'Spin up Linux desktops, drive browser and desktop windows, execute code, capture screenshots, and persist state — the REST primitives AI agents need to operate real software.'
      : 'Crea escritorios Linux, controla ventanas del navegador y del sistema, ejecuta código, captura pantallas y persiste estado — las primitivas REST que tus agentes de IA necesitan para operar software real.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      url: `https://cyqle.in/${locale}/api-docs`,
      siteName: 'Cyqle',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates,
  };
}

const CAPABILITY_ICONS = [MonitorPlay, Terminal, Code2, Camera, FileUp, Layers, Network, Bot];

export default async function ApiDocsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('apiDocsPage');

  const capabilities = t.raw('capabilities.items') as Array<{
    title: string;
    description: string;
  }>;

  return (
    <div id="top" className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      <a
        href="#after-docs-iframe"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#FF7600] focus:text-black focus:font-semibold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        {t('a11y.skipIframe')}
      </a>

      <main id="main-content" tabIndex={-1}>
        {/* Intro */}
        <AnimatedSection className="relative z-10 pt-32 pb-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight [text-wrap:balance]">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl [text-wrap:pretty]">
              {t('hero.description')}
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mt-4">
              {t('hero.agentNote')}
            </p>

            {/* Meta chips — establish technical credibility immediately */}
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/60 px-3 py-1.5">
                <span className="text-gray-500 uppercase tracking-wider">{t('meta.baseUrl')}</span>
                <span className="text-[#FF7600]">{BASE_URL}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/60 px-3 py-1.5">
                <span className="text-gray-500 uppercase tracking-wider">{t('meta.auth')}</span>
                <span className="text-white">{t('meta.authValue')}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/60 px-3 py-1.5">
                <span className="text-gray-500 uppercase tracking-wider">{t('meta.spec')}</span>
                <span className="text-white">{t('meta.specValue')}</span>
              </span>
            </div>

            <section aria-labelledby="capabilities-heading" className="mt-12">
              <h2
                id="capabilities-heading"
                className="text-2xl md:text-3xl font-bold text-white mb-6"
              >
                {t('capabilities.heading')}
              </h2>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {capabilities.map((cap, i) => {
                  const Icon = CAPABILITY_ICONS[i] ?? Bot;
                  const index = String(i + 1).padStart(2, '0');
                  return (
                    <li
                      key={i}
                      className="group relative flex flex-col gap-3 p-5 rounded-lg bg-gradient-to-b from-gray-900/60 to-gray-900/20 border border-gray-800 transition-all duration-300 motion-reduce:transition-none hover:border-[#FF7600]/50 hover:from-gray-900/80 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-3 right-3 font-mono text-[10px] tracking-widest text-gray-600 group-hover:text-[#FF7600]/70 transition-colors motion-reduce:transition-none"
                      >
                        {index}
                      </span>
                      <Icon aria-hidden="true" className="h-6 w-6 text-[#FF7600] shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1">{cap.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{cap.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="text-sm text-gray-300 mt-8">
              {t('a11y.fallback.text')}{' '}
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#FF7600] underline underline-offset-2 hover:text-[#FF9033] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7600] rounded-sm"
              >
                {t('a11y.openInNewTab')}
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only"> {t('a11y.newTabSuffix')}</span>
              </a>
            </p>
          </div>
        </AnimatedSection>

        {/* Dark → white handoff strip */}
        <section className="relative z-10" aria-hidden="true">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-8 pb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF7600] mb-2">
                  {t('handoff.eyebrow')}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white">{t('handoff.title')}</p>
                <p className="text-sm text-gray-400 mt-2 max-w-xl">{t('handoff.subtitle')}</p>
              </div>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FF7600] transition-colors self-start md:self-end"
              >
                <span className="font-mono">api.cyqle.in/docs</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FF7600]/60 to-transparent mb-4" />
          </div>
        </section>

        {/* Swagger UI embed — framed, elevated, contained */}
        <section className="relative z-10" aria-labelledby="api-reference-heading">
          <h2 id="api-reference-heading" className="sr-only">
            {t('a11y.iframeSectionHeading')}
          </h2>
          <div className="container mx-auto px-0 md:px-4 max-w-7xl">
            <div className="relative overflow-hidden bg-white md:rounded-t-2xl md:ring-1 md:ring-white/10 md:shadow-[0_-10px_40px_-10px_rgba(255,118,0,0.15)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF7600] to-transparent"
              />
              <iframe
                src={DOCS_URL}
                title={t('iframe.title')}
                aria-label={t('iframe.ariaLabel')}
                className="block w-full border-0 h-[calc(100vh-4rem)] min-h-[720px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <div id="after-docs-iframe" tabIndex={-1} className="sr-only">
          {t('a11y.endOfIframe')}
        </div>

        {/* End-of-docs CTA — rescue users who reached the bottom */}
        <AnimatedSection className="relative z-10 py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-[#FF7600]/20 bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-900/40 p-8 md:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FF7600]/20 blur-3xl"
              />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF7600] mb-3">
                {t('endCta.eyebrow')}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 [text-wrap:balance]">
                {t('endCta.title')}
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl">
                {t('endCta.description')}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <TrackedLink
                  href="https://app.cyqle.in"
                  trackingKey="ctaStartTrial"
                  className="inline-flex items-center gap-2 bg-[#FF7600] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF7600]/90 transition-colors"
                >
                  {t('endCta.primary')}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </TrackedLink>
                <a href="#top" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('endCta.secondary')} →
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
      <BackToTop label={t('backToTop')} />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
