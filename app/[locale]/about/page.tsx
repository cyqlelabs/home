import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ParallaxBackground from '@/components/parallax-background';
import { Badge } from '@/components/ui/badge';
import { type Metadata } from 'next';
import { getSEOAlternates, localeTags, siteMetadata, type SiteLocale } from '@/lib/site-metadata';
import TrackedLink from '@/components/tracked-link';
import { CheckCircle2 } from 'lucide-react';
import CursorCrowd from '@/components/about/cursor-crowd';
import CursorIcon from '@/components/about/cursor-icon';
import StoryRail from '@/components/about/story-rail';
import AgentDemo from '@/components/about/agent-demo';
import ErasureCard from '@/components/about/erasure-card';
import { Reveal, Stagger, StaggerItem } from '@/components/about/reveal';

type Props = {
  params: { locale: string };
};

const CURSOR_COLORS = ['#FF5F56', '#2DD4BF', '#4ADE80', '#A78BFA', '#FF7600', '#38BDF8'];

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/about');

  const title = t('metaTitle');
  const description = t('metaDescription');

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
      'AI agent desktop',
      'computer use agents',
      'AI agent sandbox',
      'ephemeral environments',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: localeTags[locale as SiteLocale].replace('-', '_'),
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
    <div className="min-h-screen overflow-hidden bg-transparent text-foreground">
      <ParallaxBackground />
      <Navbar />

      {/* 1 · The Belief */}
      <section className="relative z-10 pb-28 pt-32 md:pb-36">
        <CursorCrowd agentLabel={t('hero.agentTag')} />
        <div className="container relative mx-auto max-w-5xl px-4 text-center">
          <Reveal>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <span className="block text-balance text-gray-500">
                {t.rich('hero.titleLine1', {
                  s: (chunks) => (
                    <s className="whitespace-nowrap decoration-[#FF7600]/70 decoration-2">
                      {chunks}
                    </s>
                  ),
                })}
              </span>
              <span className="mt-2 block text-balance text-white">
                {t.rich('hero.titleLine2', {
                  accent: (chunks) => <span className="text-[#FF7600]">{chunks}</span>,
                })}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300 md:text-xl">
              {t('hero.subtitle')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 · The Problem */}
      <section className="relative z-10 bg-black/30 py-20 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('problem.badge')}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">{t('problem.title')}</h2>
            <p className="mb-10 border-l-2 border-[#FF7600] pl-4 text-lg italic text-gray-400">
              {t('problem.intro')}
            </p>
          </Reveal>
          <Stagger className="space-y-6" stagger={0.15}>
            <StaggerItem>
              <p className="text-lg leading-relaxed text-gray-300">{t('problem.scenario1')}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg leading-relaxed text-gray-300">{t('problem.scenario2')}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg leading-relaxed text-gray-300">{t('problem.scenario3')}</p>
            </StaggerItem>
          </Stagger>
          <Reveal delay={0.1}>
            <p className="mt-10 text-lg font-medium leading-relaxed text-gray-200">
              {t('problem.truth')}
            </p>
            <p className="mt-6 text-2xl font-bold text-white">{t('problem.solution')}</p>
          </Reveal>
        </div>
      </section>

      {/* 3 · The Origin */}
      <section className="relative z-10 bg-gradient-to-b from-gray-900/80 to-black/80 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('story.badge')}
            </Badge>
            <h2 className="mb-12 text-3xl font-bold text-white md:text-4xl">{t('story.title')}</h2>
          </Reveal>
          <StoryRail yearLabel={t('story.yearLabel')}>
            <Stagger className="space-y-6" stagger={0.18}>
              <StaggerItem>
                <p className="text-lg leading-relaxed text-gray-300">{t('story.paragraph1')}</p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-lg leading-relaxed text-gray-300">{t('story.paragraph2')}</p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-lg leading-relaxed text-gray-300">{t('story.paragraph3')}</p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-lg font-semibold leading-relaxed text-white">
                  {t('story.present')}
                </p>
              </StaggerItem>
            </Stagger>
          </StoryRail>
        </div>
      </section>

      {/* 4 · For People */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('humans.badge')}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">{t('humans.title')}</h2>
            <p className="mb-10 text-lg leading-relaxed text-gray-300">{t('humans.intro')}</p>
          </Reveal>
          <Stagger className="space-y-4" stagger={0.1}>
            {t.raw('humans.items').map((item: string, i: number) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4">
                  <CursorIcon
                    color={CURSOR_COLORS[i % CURSOR_COLORS.length]}
                    className="mt-1 h-5 w-auto shrink-0"
                  />
                  <span className="text-lg text-gray-300">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.15}>
            <p className="mt-10 text-lg italic text-gray-400">{t('humans.note')}</p>
          </Reveal>
        </div>
      </section>

      {/* 5 · For AI Agents */}
      <section className="relative z-10 bg-black/30 py-20 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <Reveal>
                <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
                  {t('agents.badge')}
                </Badge>
                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                  {t('agents.title')}
                </h2>
              </Reveal>
              <Stagger className="space-y-5" stagger={0.15}>
                <StaggerItem>
                  <p className="text-lg leading-relaxed text-gray-300">{t('agents.paragraph1')}</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-lg leading-relaxed text-gray-300">{t('agents.paragraph2')}</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-lg leading-relaxed text-gray-300">{t('agents.paragraph3')}</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-lg font-medium leading-relaxed text-gray-200">
                    {t('agents.proof')}
                  </p>
                </StaggerItem>
              </Stagger>
            </div>
            <Reveal delay={0.2}>
              <AgentDemo
                agentLabel={t('agents.demo.agentLabel')}
                humanLabel={t('agents.demo.humanLabel')}
                takeoverLabel={t('agents.demo.takeover')}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 · Under the Hood */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('difference.badge')}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              {t('difference.title')}
            </h2>
            <p className="mb-10 text-lg text-gray-300">{t('difference.intro')}</p>
          </Reveal>
          <Stagger className="space-y-3" stagger={0.12}>
            {t.raw('difference.challenges').map((challenge: string, i: number) => (
              <StaggerItem key={i} depth>
                <div
                  className="border-l-2 py-2 pl-4"
                  style={{
                    marginLeft: i * 12,
                    borderColor: `rgba(255,118,0,${0.9 - i * 0.15})`,
                  }}
                >
                  <span className="text-gray-300">{challenge}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <p className="mt-10 text-lg font-medium text-gray-200">{t('difference.conclusion')}</p>
          </Reveal>
        </div>
      </section>

      {/* 7 · What We Believe */}
      <section className="relative z-10 bg-gradient-to-b from-gray-900/80 to-black/80 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <Reveal>
                <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
                  {t('principles.badge')}
                </Badge>
                <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
                  {t('principles.title')}
                </h2>
              </Reveal>
              <Stagger className="space-y-5" stagger={0.12}>
                {t.raw('principles.items').map((item: string, i: number) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3">
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#FF7600]" />
                      <span className="text-lg text-gray-200">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <Reveal delay={0.2} className="flex justify-center">
              <ErasureCard
                statusRunning={t('principles.erasure.running')}
                statusDestroyed={t('principles.erasure.destroyed')}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8 · Where We're Headed */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <Badge variant="outline" className="mb-6 border-[#FF7600] text-[#FF7600]">
              {t('vision.badge')}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">{t('vision.title')}</h2>
            <p className="mb-10 text-lg leading-relaxed text-gray-300">{t('vision.intro')}</p>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.1}>
            {t.raw('vision.future').map((point: string, i: number) => (
              <StaggerItem key={i}>
                <div className="flex h-full gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-4 transition-colors hover:border-[#FF7600]/30">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7600]" />
                  <span className="text-gray-300">{point}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 9 · CTA */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">{t('cta.title')}</h2>
            <p className="mb-10 whitespace-pre-line text-xl text-gray-300">
              {t('cta.description')}
            </p>
            <div className="relative inline-block">
              <CursorIcon
                color="#2DD4BF"
                className="absolute -left-14 top-1 hidden h-6 w-auto rotate-[35deg] opacity-70 sm:block"
              />
              <CursorIcon
                color="#A78BFA"
                className="absolute -right-14 bottom-1 hidden h-6 w-auto -rotate-[125deg] opacity-70 sm:block"
              />
              <TrackedLink
                href="https://app.cyqle.in/signup"
                trackingKey="aboutPageCTA"
                className="inline-block rounded-lg bg-[#FF7600] px-8 py-4 text-lg font-semibold text-white shadow-[0_0_50px_rgba(255,118,0,0.3)] transition-all hover:scale-[1.03] hover:bg-[#FF7600]/90 hover:shadow-[0_0_70px_rgba(255,118,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7600] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t('cta.button')}
              </TrackedLink>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return siteMetadata.locales.map((locale) => ({ locale }));
}
