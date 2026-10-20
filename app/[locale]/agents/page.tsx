import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { type Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Check, Minus } from 'lucide-react';
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
import SandboxDemo, { type SandboxLabels } from '@/components/agents/sandbox-demo';
import { getSEOAlternates, localeTags, siteMetadata, type SiteLocale } from '@/lib/site-metadata';
import { getPricing } from '@/lib/pricing';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'agentsPage' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/agents');

  const title = t('metaTitle');
  const description = t('metaDescription');

  return {
    title,
    description,
    keywords: [
      'AI agent sandbox',
      'sandbox for AI agents',
      'computer use agent sandbox',
      'browser agent sandbox',
      'cloud desktop for AI agents',
      'isolated environment for AI agents',
      'human in the loop AI agents',
      'run AI agents in the cloud',
      'AI agent infrastructure',
      'Linux desktop API',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: localeTags[locale as SiteLocale].replace('-', '_'),
      url: `https://cyqle.in/${locale}/agents`,
      siteName: 'Cyqle',
      images: [{ url: siteMetadata.socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteMetadata.socialImage],
    },
    alternates,
  };
}

const ENDPOINTS = [
  { method: 'POST', path: '/v1/sessions', key: 'boot' },
  { method: 'GET', path: '/v1/sessions/{id}/capture/{w}/{h}/{x}/{y}', key: 'capture' },
  { method: 'POST', path: '/v1/sessions/{id}/input/mouse', key: 'mouse' },
  { method: 'POST', path: '/v1/sessions/{id}/input/keyboard', key: 'keyboard' },
  { method: 'POST', path: '/v1/sessions/{id}/exec', key: 'exec' },
  { method: 'POST', path: '/v1/snapshots', key: 'snapshot' },
  { method: 'PUT', path: '/v1/sessions/{id}/pause', key: 'pause' },
  { method: 'DELETE', path: '/v1/sessions/{id}', key: 'close' },
] as const;

const PRIMARY_CTA =
  'bg-[#FF7600] font-semibold text-gray-950 shadow-lg shadow-[#FF7600]/20 hover:bg-[#ff8a24]';

export default async function AgentsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('agentsPage');
  const pricing = await getPricing();
  const { free, lite, max } = pricing.plans;

  const compareRows = t.raw('compare.rows') as Array<{
    label: string;
    laptop: string;
    headless: string;
    cyqle: string;
  }>;
  const features = t.raw('features.items') as Array<{
    label: string;
    title: string;
    description: string;
  }>;
  const steps = t.raw('steps.items') as Array<{ title: string; description: string }>;
  const faqItems = t.raw('faq.items') as Array<{ q: string; a: string }>;
  const demoLabels = t.raw('demo.labels') as unknown as SandboxLabels;
  const columns = ['laptop', 'headless', 'cyqle'] as const;

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-foreground">
      <ParallaxBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 overflow-hidden bg-[#08182b] lg:min-h-screen">
        <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-4 pb-20 pt-28 lg:min-h-screen lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:pt-32">
          <div className="text-center lg:text-left">
            <div className="reveal-on-load">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-teal-300">
                {t('hero.eyebrow')}
              </p>
            </div>
            <div className="reveal-on-load [animation-delay:0.08s]">
              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white [word-break:keep-all] md:text-6xl">
                {t.rich('hero.title', {
                  box: (chunks) => (
                    <span className="relative mx-1 inline-block whitespace-nowrap rounded-lg border border-dashed border-teal-400/60 px-2 pb-1 text-teal-200">
                      {chunks}
                    </span>
                  ),
                })}
              </h1>
            </div>
            <div className="reveal-on-load [animation-delay:0.18s]">
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-gray-300 md:text-xl lg:mx-0">
                {t('hero.subtitle')}
              </p>
            </div>
            <div className="reveal-on-load [animation-delay:0.28s]">
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className={PRIMARY_CTA}>
                  <TrackedLink href="https://app.cyqle.in/signup" trackingKey="agentsHeroSignup">
                    {t('hero.ctaPrimary')}
                  </TrackedLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-200 hover:border-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <TrackedLink href="#api" trackingKey="agentsHeroApi">
                    {t('hero.ctaSecondary')}
                  </TrackedLink>
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                {t('hero.note', { minutes: free.sessionMinutes })}
              </p>
            </div>
          </div>
          <div className="reveal-on-load [animation-delay:0.35s]">
            <p className="sr-only">{t('demo.summary')}</p>
            <SandboxDemo labels={demoLabels} />
          </div>
        </div>
      </section>

      {/* Where should your agent run? */}
      <section className="relative z-10 bg-gradient-to-b from-[#08182b] to-black/70 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
              {t('compare.title')}
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-gray-400">
              {t('compare.intro')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <table className="hidden w-full table-fixed border-separate border-spacing-0 text-left md:table">
              <thead>
                <tr>
                  <td className="w-[19%] pb-4 pt-4" />
                  <th scope="col" className="px-5 pb-4 pt-4 text-sm font-semibold text-gray-400">
                    {t('compare.columns.laptop')}
                  </th>
                  <th scope="col" className="px-5 pb-4 pt-4 text-sm font-semibold text-gray-400">
                    {t('compare.columns.headless')}
                  </th>
                  <th
                    scope="col"
                    className="rounded-t-xl border-x border-t border-dashed border-teal-400/50 bg-teal-400/[0.04] px-5 pb-4 pt-4 text-sm font-semibold text-teal-200"
                  >
                    {t('compare.columns.cyqle')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, index) => {
                  const last = index === compareRows.length - 1;
                  return (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="border-t border-gray-800 py-5 pr-4 align-top font-mono text-xs font-normal uppercase tracking-wider text-gray-400"
                      >
                        {row.label}
                      </th>
                      <td className="border-t border-gray-800 px-5 py-5 align-top text-gray-400">
                        {row.laptop}
                      </td>
                      <td className="border-t border-gray-800 px-5 py-5 align-top text-gray-400">
                        {row.headless}
                      </td>
                      <td
                        className={`border-x border-t border-dashed border-x-teal-400/50 border-t-gray-800 bg-teal-400/[0.04] px-5 py-5 align-top text-gray-100 ${
                          last ? 'rounded-b-xl border-b border-b-teal-400/50' : ''
                        }`}
                      >
                        {row.cyqle}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <dl className="space-y-4 md:hidden">
              {compareRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-gray-800 bg-gray-900/40 p-5"
                >
                  <dt className="mb-3 font-mono text-xs uppercase tracking-wider text-gray-400">
                    {row.label}
                  </dt>
                  {columns.map((column) => (
                    <dd
                      key={column}
                      className={`mt-2 text-sm ${
                        column === 'cyqle'
                          ? 'rounded-lg border border-dashed border-teal-400/50 bg-teal-400/[0.04] p-3 text-gray-100'
                          : 'text-gray-400'
                      }`}
                    >
                      <span
                        className={`block text-xs font-semibold ${
                          column === 'cyqle' ? 'text-teal-200' : 'text-gray-400'
                        }`}
                      >
                        {t(`compare.columns.${column}`)}
                      </span>
                      {row[column]}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* What each desktop gives your agent */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">
              {t('features.title')}
            </h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-x-12 md:grid-cols-2" stagger={0.08}>
            {features.map((feature) => (
              <StaggerItem key={feature.label}>
                <div className="h-full border-t border-gray-800 py-7">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-teal-300">
                    {feature.label}
                  </p>
                  <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-400">{feature.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* API */}
      <div id="api" />
      <section className="relative z-10 bg-gradient-to-b from-black/60 via-gray-950/40 to-black/60 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal className="order-2 min-w-0 lg:order-1">
              <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#08182b] shadow-2xl shadow-teal-950/30">
                <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span aria-hidden="true" className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span aria-hidden="true" className="h-3 w-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-xs text-gray-400">{t('api.codeLabel')}</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-gray-200 md:p-6 md:text-[0.85rem]">
                  <code>
                    <span className="text-gray-400"># {t('api.comments.boot')}</span>
                    {'\n'}SID=$(<span className="text-teal-300">curl</span> -sS -X POST
                    https://api.cyqle.in/v1/sessions \{'\n'}
                    {'  '}-H{' '}
                    <span className="text-green-400">
                      &quot;Authorization: Bearer $CYQLE_KEY&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-H{' '}
                    <span className="text-green-400">
                      &quot;Content-Type: application/json&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-d{' '}
                    <span className="text-green-400">
                      &quot;{'{'}\&quot;snapshotId\&quot;:\&quot;$SNAPSHOT\&quot;{'}'}&quot;
                    </span>{' '}
                    | <span className="text-teal-300">jq</span> -r .data.id){'\n'}
                    until <span className="text-teal-300">curl</span> -sS{' '}
                    <span className="text-green-400">
                      &quot;https://api.cyqle.in/v1/sessions/$SID&quot;
                    </span>{' '}
                    \{'\n'}
                    {'    '}-H{' '}
                    <span className="text-green-400">
                      &quot;Authorization: Bearer $CYQLE_KEY&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}| <span className="text-teal-300">jq</span> -e{' '}
                    <span className="text-green-400">
                      &apos;.data.status == &quot;RUNNING&quot;&apos;
                    </span>{' '}
                    &gt;/dev/null{'\n'}
                    do sleep 2; done{'\n'}
                    {'\n'}
                    <span className="text-gray-400"># {t('api.comments.act')}</span>
                    {'\n'}
                    <span className="text-teal-300">curl</span> -X POST \{'\n'}
                    {'  '}
                    <span className="text-green-400">
                      &quot;https://api.cyqle.in/v1/sessions/$SID/input/mouse&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-H{' '}
                    <span className="text-green-400">
                      &quot;Authorization: Bearer $CYQLE_KEY&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-H{' '}
                    <span className="text-green-400">
                      &quot;Content-Type: application/json&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-d{' '}
                    <span className="text-green-400">
                      &apos;{'{'}
                      &quot;action&quot;:&quot;click&quot;,&quot;x&quot;:640,&quot;y&quot;:360,
                      {'\n'}
                      {'       '}&quot;pointerId&quot;:&quot;my-agent&quot;
                      {'}'}&apos;
                    </span>
                    {'\n'}
                    {'\n'}
                    <span className="text-gray-400"># {t('api.comments.pause')}</span>
                    {'\n'}
                    <span className="text-teal-300">curl</span> -X PUT{' '}
                    <span className="text-green-400">
                      &quot;https://api.cyqle.in/v1/sessions/$SID/pause&quot;
                    </span>{' '}
                    \{'\n'}
                    {'  '}-H{' '}
                    <span className="text-green-400">
                      &quot;Authorization: Bearer $CYQLE_KEY&quot;
                    </span>
                  </code>
                </pre>
              </div>
            </Reveal>
            <Reveal className="order-1 space-y-6 lg:order-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-300">
                {t('api.eyebrow')}
              </p>
              <h2 className="text-3xl font-bold text-white [text-wrap:balance] md:text-4xl">
                {t('api.title')}
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">{t('api.description')}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-16">
            <h3 className="mb-4 text-sm font-semibold text-gray-300">{t('api.endpointsTitle')}</h3>
            <ul className="divide-y divide-gray-800 border-y border-gray-800">
              {ENDPOINTS.map((endpoint) => (
                <li
                  key={endpoint.key}
                  className="grid grid-cols-1 gap-1 py-3 md:grid-cols-[4.5rem_minmax(0,1.3fr)_minmax(0,1fr)] md:items-baseline md:gap-4"
                >
                  <span className="font-mono text-xs font-semibold text-teal-300">
                    {endpoint.method}
                  </span>
                  <code className="break-all font-mono text-sm text-gray-200">{endpoint.path}</code>
                  <span className="text-sm text-gray-400">
                    {t(`api.endpoints.${endpoint.key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                className="border-gray-600 text-gray-200 hover:border-gray-400 hover:bg-white/5 hover:text-white"
              >
                <TrackedLink
                  href="https://api.cyqle.in/docs/"
                  trackingKey="agentsApiDocs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('api.cta')}
                  <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </TrackedLink>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How a run works */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">{t('steps.title')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="relative flex gap-5 md:block">
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-10 left-4 top-8 border-l border-dashed border-teal-400/40 md:-right-10 md:bottom-auto md:left-10 md:top-4 md:border-l-0 md:border-t"
                    />
                  )}
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-400/60 bg-gray-950 font-mono text-sm text-teal-200 md:mb-5">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                    <p className="leading-relaxed text-gray-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Factor */}
      <section className="relative z-10 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-2xl border border-sky-800/50 bg-gradient-to-br from-sky-950/60 to-[#08182b] p-8 sm:flex-row sm:items-center md:p-10">
              <FactorMark size={56} className="shrink-0" />
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium text-sky-300">{t('factor.eyebrow')}</p>
                <h2 className="mb-2 text-2xl font-bold text-white">{t('factor.title')}</h2>
                <p className="leading-relaxed text-gray-300">{t('factor.description')}</p>
                <TrackedLink
                  href={`/${locale}/factor`}
                  trackingKey="agentsMeetFactor"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
                >
                  {t('factor.link')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <Reveal>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              {t('pricing.title')}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/40 p-7">
                <h3 className="text-lg font-semibold text-white">{t('pricing.free.name')}</h3>
                <p className="mt-2 text-4xl font-bold text-white">
                  {t('pricing.free.price', { price: free.monthly })}
                  <span className="mt-1 block text-base font-normal text-gray-400">
                    {t('pricing.free.per')}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.free.time', { minutes: free.sessionMinutes })}
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.free.specs', { vcpu: free.vcpu, ram: free.ramGB })}
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.free.api')}
                  </li>
                  <li className="flex gap-3 text-gray-400">
                    <Minus className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('pricing.free.fresh')}
                  </li>
                  <li className="flex gap-3 text-gray-400">
                    <Minus className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('pricing.free.snapshots')}
                  </li>
                  <li className="flex gap-3 text-gray-400">
                    <Minus className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('pricing.free.factor')}
                  </li>
                </ul>
                <Button asChild className={`mt-8 ${PRIMARY_CTA}`}>
                  <TrackedLink href="https://app.cyqle.in/signup" trackingKey="agentsPricingSignup">
                    {t('pricing.free.cta')}
                  </TrackedLink>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-dashed border-teal-400/50 bg-teal-400/[0.04] p-7">
                <h3 className="text-lg font-semibold text-white">{t('pricing.paid.name')}</h3>
                <p className="mt-2 text-4xl font-bold text-white">
                  {t('pricing.paid.price', { from: lite.monthly })}
                  <span className="mt-1 block text-base font-normal text-gray-400">
                    {t('pricing.paid.per')}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.paid.time')}
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.paid.storage')}
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.paid.specs', { vcpu: max.vcpu, ram: max.ramGB })}
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                    {t('pricing.paid.factor')}
                  </li>
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 border-gray-600 text-gray-200 hover:border-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <TrackedLink href={`/${locale}#pricing`} trackingKey="agentsComparePlans">
                    {t('pricing.paid.cta')}
                  </TrackedLink>
                </Button>
              </div>
            </Reveal>
          </div>
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
            <h2 className="mb-5 text-balance text-3xl font-bold md:text-4xl">
              {t('finalCta.title')}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
              {t('finalCta.description')}
            </p>
            <Button asChild size="lg" className={PRIMARY_CTA}>
              <TrackedLink href="https://app.cyqle.in/signup" trackingKey="agentsFinalCta">
                {t('finalCta.button')}
              </TrackedLink>
            </Button>
            <p className="mt-6 text-sm text-gray-400">
              {t('finalCta.note', { from: lite.monthly })}
            </p>
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
