import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { type Metadata } from 'next';
import {
  AppWindow,
  Eye,
  FlaskConical,
  History,
  Landmark,
  ShieldCheck,
  TerminalSquare,
  Wallet,
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ParallaxBackground from '@/components/parallax-background';
import TrackedLink from '@/components/tracked-link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal, Stagger, StaggerItem } from '@/components/about/reveal';
import FactorMark from '@/components/factor/factor-mark';
import HeroVisual from '@/components/factor/hero-visual';
import CodriveDemo, { type CodriveLabels } from '@/components/factor/codrive-demo';
import { getSEOAlternates, localeTags, siteMetadata, type SiteLocale } from '@/lib/site-metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'factorPage' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/factor');

  const title = t('metaTitle');
  const description = t('metaDescription');

  return {
    title,
    description,
    keywords: [
      'AI agent',
      'computer use agent',
      'AI browser automation',
      'AI desktop automation',
      'supervised AI agent',
      'human in the loop automation',
      'RPA alternative',
      'cloud desktop AI agent',
      'co-driving AI agent',
      'AI workflow automation',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: localeTags[locale as SiteLocale].replace('-', '_'),
      url: `https://cyqle.in/${locale}/factor`,
      siteName: 'Cyqle',
      images: [{ url: '/og-factor.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-factor.png'],
    },
    alternates,
  };
}

const PILLAR_ICONS = [Eye, AppWindow, History, Wallet];
const SEGMENT_ICONS = [FlaskConical, Landmark, TerminalSquare];

export default async function FactorPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('factorPage');

  const pillars = t.raw('pillars.items') as Array<{ title: string; description: string }>;
  const segments = t.raw('segments.items') as Array<{ title: string; description: string }>;
  const faqItems = t.raw('faq.items') as Array<{ q: string; a: string }>;
  const demoLabels = t.raw('demo.labels') as unknown as CodriveLabels;

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-foreground">
      <ParallaxBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen items-center overflow-hidden bg-[#08182b]">
        <HeroVisual />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 70% at 50% 45%, rgba(8,24,43,0) 0%, rgba(8,24,43,0.55) 68%, rgba(8,24,43,0.92) 100%)',
          }}
        />
        <div className="container relative z-10 mx-auto px-4 pb-20 pt-32 text-center">
          <div className="reveal-on-load">
            <div className="mb-6 flex items-center justify-center gap-4">
              <FactorMark size={72} className="drop-shadow-[0_0_24px_rgba(14,165,233,0.45)]" />
              <div className="text-left">
                <p className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  Factor
                </p>
                <p className="text-sm font-semibold text-[#FF7600]">{t('hero.endorsement')}</p>
              </div>
            </div>
          </div>
          <div className="reveal-on-load [animation-delay:0.1s]">
            <p className="mx-auto mb-5 inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-300">
              {t('hero.eyebrow')}
            </p>
          </div>
          <div className="reveal-on-load [animation-delay:0.18s]">
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
              {t('hero.title')}
            </h1>
          </div>
          <div className="reveal-on-load [animation-delay:0.28s]">
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-gray-300 md:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="reveal-on-load [animation-delay:0.38s]">
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-900/40 hover:from-[#38bdf8] hover:to-[#0284c7]"
              >
                <TrackedLink href="https://app.cyqle.in/signup" trackingKey="factorHeroSignup">
                  {t('hero.ctaPrimary')}
                </TrackedLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-200 hover:border-gray-400 hover:bg-white/5 hover:text-white"
              >
                <TrackedLink href="#codrive" trackingKey="factorHeroDemo">
                  {t('hero.ctaSecondary')}
                </TrackedLink>
              </Button>
            </div>
          </div>
          <div className="reveal-on-load [animation-delay:0.5s]">
            <p className="mt-8 text-sm text-gray-500">{t('hero.creditsNote')}</p>
          </div>
        </div>
      </section>

      {/* Co-drive demo */}
      <div id="codrive" />
      <section className="relative z-10 bg-gradient-to-b from-[#08182b] to-black/70 py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <Reveal>
            <h2 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
              {t('demo.title')}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">{t('demo.caption')}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <CodriveDemo labels={demoLabels} />
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">
              {t('pillars.title')}
            </h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.12}>
            {pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index] ?? Eye;
              return (
                <StaggerItem key={pillar.title}>
                  <div className="h-full rounded-xl border border-gray-800 bg-gray-900/40 p-6 transition-colors duration-300 hover:border-sky-700/60">
                    <div className="mb-4 inline-flex rounded-lg bg-sky-500/10 p-2.5">
                      <Icon className="h-6 w-6 text-sky-400" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{pillar.title}</h3>
                    <p className="leading-relaxed text-gray-400">{pillar.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Segments */}
      <section className="relative z-10 bg-black/40 py-24 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">
              {t('segments.title')}
            </h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-8 lg:grid-cols-3" stagger={0.12}>
            {segments.map((segment, index) => {
              const Icon = SEGMENT_ICONS[index] ?? FlaskConical;
              return (
                <StaggerItem key={segment.title}>
                  <div className="h-full rounded-xl border border-gray-800 bg-gray-900/40 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-gray-500/15 p-2">
                        <Icon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{segment.title}</h3>
                    </div>
                    <p className="leading-relaxed text-gray-400">{segment.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Oversight */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <div className="rounded-2xl border border-sky-800/50 bg-gradient-to-br from-sky-950/60 to-[#08182b] p-8 md:p-10">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-sky-400" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  {t('oversight.title')}
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">{t('oversight.description')}</p>
              <p className="mt-5 border-l-2 border-gray-700 pl-4 text-sm text-gray-500">
                {t('oversight.byoNote')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 bg-black/40 py-24 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{t('faq.title')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left text-base text-gray-200 hover:text-white">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-gray-400">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <h2 className="mb-5 text-3xl font-bold md:text-4xl">{t('finalCta.title')}</h2>
            <p className="mx-auto mb-10 max-w-2xl whitespace-pre-line text-lg text-gray-300">
              {t('finalCta.description')}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-900/40 hover:from-[#38bdf8] hover:to-[#0284c7]"
            >
              <TrackedLink href="https://app.cyqle.in/signup" trackingKey="factorFinalCta">
                {t('finalCta.button')}
              </TrackedLink>
            </Button>
            <p className="mt-6 text-sm text-gray-500">{t('finalCta.trialInfo')}</p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return siteMetadata.locales.map((locale) => ({ locale }));
}
