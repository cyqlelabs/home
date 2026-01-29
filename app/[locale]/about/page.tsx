import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Metadata } from 'next';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';
import TrackedLink from '@/components/tracked-link';
import {
  Network,
  Zap,
  HardDrive,
  Bot,
  ShieldCheck,
  Cpu,
  Files,
  Server,
  CheckCircle2,
} from 'lucide-react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/about');

  const title =
    locale === 'en'
      ? 'About Cyqle: Multiplayer Cloud Desktop for Real-Time Collaboration'
      : 'Acerca de Cyqle: Escritorio Cloud Multijugador para Colaboración en Tiempo Real';

  const description =
    locale === 'en'
      ? 'Built for teams tired of taking turns. Cyqle is a P2P cloud desktop where everyone types in parallel—multiple people, multiple keyboards, same machine. No more "can you see my screen?" Perfect for remote debugging, pair programming, and real-time collaboration.'
      : 'Construido para equipos cansados de turnarse. Cyqle es un escritorio cloud P2P donde todos escriben en paralelo—múltiples personas, múltiples teclados, misma máquina. Se acabó el "¿ven mi pantalla?" Perfecto para depuración remota, programación en pareja y colaboración en tiempo real.';

  return {
    title,
    description,
    keywords: [
      'multiplayer cloud desktop',
      'real-time collaboration',
      'remote pair programming',
      'screen sharing alternative',
      'collaborative debugging',
      'P2P desktop',
      'multi-cursor workspace',
      'remote development environment',
      'cloud collaboration platform',
      'simultaneous editing',
      'remote QA testing',
      'browser automation',
      'AI automation',
      'ephemeral environments',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      url: `https://cyqle.in/${locale}/about`,
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

export default async function AboutPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('aboutPage');

  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      {/* Hero Section */}
      <AnimatedSection className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto whitespace-pre-line">
            {t('hero.subtitle')}
          </p>
        </div>
      </AnimatedSection>

      {/* Problem Section */}
      <AnimatedSection className="relative z-10 py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('problem.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('problem.title')}</h2>
          <p className="text-gray-400 mb-8 text-lg italic">{t('problem.intro')}</p>
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">{t('problem.scenario1')}</p>
            <p className="text-lg text-gray-300 leading-relaxed">{t('problem.scenario2')}</p>
            <p className="text-lg text-gray-300 leading-relaxed">{t('problem.scenario3')}</p>
            <p className="text-lg text-gray-200 leading-relaxed font-medium mt-8">
              {t('problem.truth')}
            </p>
            <p className="text-xl text-white font-bold mt-6">{t('problem.solution')}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Origin Story Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-gray-900/80 to-black/80">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('story.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{t('story.title')}</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>{t('story.year2017')}</p>
            <p className="text-gray-400 italic">{t('story.pivot')}</p>
            <p>{t('story.year2025')}</p>
            <p>{t('story.realization')}</p>
            <p className="text-white font-semibold">{t('story.present')}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Solution Section */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('solution.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{t('solution.title')}</h2>
          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">{t('solution.paragraph1')}</p>
            <p className="text-lg text-gray-300 leading-relaxed">{t('solution.paragraph2')}</p>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">{t('solution.realityCheck')}</h3>
          <ul className="space-y-3">
            {t.raw('solution.painPoints').map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#FF7600] shrink-0 mt-1" />
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* Technical Difference Section */}
      <AnimatedSection className="relative z-10 py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('difference.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t('difference.title')}
          </h2>
          <p className="text-lg text-gray-300 mb-6">{t('difference.intro')}</p>
          <ul className="space-y-3 mb-8">
            {t.raw('difference.challenges').map((challenge: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-2 w-2 mt-2.5 rounded-full bg-[#FF7600] shrink-0" />
                <span className="text-gray-300">{challenge}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg text-gray-200 font-medium">{t('difference.conclusion')}</p>
        </div>
      </AnimatedSection>

      {/* For Whom Section */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('forWhom.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{t('forWhom.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.raw('forWhom.items').map((item: string, i: number) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-[#FF7600]/30 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-[#FF7600] shrink-0 mt-0.5" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Vision Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-gray-900/80 to-black/80">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
            {t('vision.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{t('vision.title')}</h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">{t('vision.intro')}</p>
          <ul className="space-y-3">
            {t.raw('vision.future').map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#FF7600] shrink-0 mt-1" />
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-300 mb-8">{t('cta.description')}</p>
          <TrackedLink
            href="https://app.cyqle.in"
            trackingKey="aboutPageCTA"
            className="inline-block bg-[#FF7600] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FF7600]/90 transition-colors"
          >
            {t('cta.button')}
          </TrackedLink>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
