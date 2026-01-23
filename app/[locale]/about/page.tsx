import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Metadata } from 'next';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';
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
  return {
    title: t('hero.title'),
    description: t('hero.description'),
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
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7600]/80 via-[#FF7600] to-[#FF7600]/80 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-semibold max-w-4xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </AnimatedSection>

      {/* Mission Section */}
      <AnimatedSection className="relative z-10 py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 border-[#FF7600] text-[#FF7600]">
            {t('mission.title')}
          </Badge>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{t('mission.content')}</p>
        </div>
      </AnimatedSection>

      {/* Architecture & Features Grid */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Network className="h-10 w-10 text-[#FF7600] mb-4" />
                <CardTitle className="text-white">{t('features.p2p.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base">
                  {t('features.p2p.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Zap className="h-10 w-10 text-[#FF7600] mb-4" />
                <CardTitle className="text-white">{t('features.provisioning.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base">
                  {t('features.provisioning.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <HardDrive className="h-10 w-10 text-[#FF7600] mb-4" />
                <CardTitle className="text-white">{t('features.persistence.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base">
                  {t('features.persistence.description')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Bot className="h-10 w-10 text-[#FF7600] mb-4" />
                <CardTitle className="text-white">{t('features.automation.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base">
                  {t('features.automation.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Isolation Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-gray-900/80 to-black/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <ShieldCheck className="h-16 w-16 text-[#FF7600] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('isolation.title')}
            </h2>
            <p className="text-gray-300 max-w-3xl text-lg">{t('isolation.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="h-6 w-6 text-blue-400" />
                <h3 className="font-semibold text-white">Secure Sandbox</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Every session runs in a dedicated, isolated environment.
              </p>
            </div>
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Files className="h-6 w-6 text-green-400" />
                <h3 className="font-semibold text-white">Private Storage</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Session-scoped data remains private and ephemeral.
              </p>
            </div>
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Server className="h-6 w-6 text-purple-400" />
                <h3 className="font-semibold text-white">Guaranteed Speed</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Strict resource allocation prevents neighbor interference.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <ul className="inline-block text-left space-y-2">
              {t.raw('isolation.points').map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-[#FF7600] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      {/* Use Cases List */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            {t('useCases.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {t.raw('useCases.items').map((item: string, i: number) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-[#FF7600]/30 transition-colors"
              >
                <div className="h-2 w-2 mt-2.5 rounded-full bg-[#FF7600] shrink-0" />
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
