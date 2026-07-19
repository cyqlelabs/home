'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PlanData, PricingData } from '@/lib/pricing';

type ProTier = 'standard' | 'turbo' | 'max';
type PlanId = 'free' | 'lite' | 'pro';
type PricingMode = 'monthly' | 'payAsYouGo';

// Credits can be fractional (e.g. 34.5); keep the dot-decimal the rest of the
// pricing UI uses rather than a locale-formatted number.
const fmtCredits = (n: number) => String(n);

export default function PricingSection({ pricing }: { pricing: PricingData }) {
  const t = useTranslations('pricing');
  const [proTier, setProTier] = useState<ProTier>('standard');
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteSeats, setQuoteSeats] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleQuoteClose = (open: boolean) => {
    setQuoteOpen(open);
    if (!open) {
      setTimeout(() => {
        setQuoteEmail('');
        setQuoteSeats('');
        setQuoteStatus('idle');
      }, 200);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus('sending');
    trackCTA.customQuoteSubmit(quoteSeats);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `Custom Quote Request - ${quoteSeats} seats`,
          from_name: 'Cyqle Website',
          email: quoteEmail,
          seats: quoteSeats,
          message: `Custom quote request:\n\nSeats needed: ${quoteSeats}\nContact email: ${quoteEmail}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuoteStatus('sent');
      } else {
        setQuoteStatus('error');
      }
    } catch {
      setQuoteStatus('error');
    }
  };

  const plans: PlanId[] = ['free', 'lite', 'pro'];

  // The effective figures for a card: "pro" resolves to the selected power tier.
  const planDataFor = (plan: PlanId): PlanData =>
    plan === 'pro' ? pricing.plans[proTier] : pricing.plans[plan];

  const getPrice = (plan: PlanId) => {
    const pd = planDataFor(plan);
    if (plan === 'free') return '$0.00';
    return pricingMode === 'monthly' ? `$${pd.monthly}` : `$${pd.creditPrice.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4">
      <style jsx>{`
        @keyframes pulse-star {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(255, 215, 0, 0.8);
          }
        }
        @keyframes pulse-green {
          0%,
          100% {
            text-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
          }
          50% {
            text-shadow: 0 0 16px rgba(74, 222, 128, 0.9);
          }
        }
      `}</style>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
        <p className="text-xl text-gray-400 mb-8">
          {pricingMode === 'monthly'
            ? t('descriptionMonthly', { from: pricing.plans.lite.monthly })
            : t('descriptionPayAsYouGo', {
                from: pricing.plans.lite.creditPrice.toFixed(2),
                hours: pricing.creditHours,
              })}
        </p>

        {/* Pricing Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-block">
            <Tabs
              value={pricingMode}
              onValueChange={(v) => setPricingMode(v as PricingMode)}
              className="w-auto"
            >
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-[#FF7600] data-[state=active]:text-white text-gray-400"
                >
                  {t('monthlyLabel')}
                </TabsTrigger>
                <TabsTrigger
                  value="payAsYouGo"
                  className="data-[state=active]:bg-[#FF7600] data-[state=active]:text-white text-gray-400"
                >
                  {t('payAsYouGoLabel')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div
              className="absolute -top-2 -left-2 bg-[#FFD700] rounded-full w-6 h-6 flex items-center justify-center pointer-events-none"
              style={{
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
                animation: 'pulse-star 2s ease-in-out infinite',
              }}
            >
              <Star className="w-4 h-4 text-[#1a1a1a] fill-[#1a1a1a]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
        {plans.map((plan) => {
          const price = getPrice(plan);

          return (
            <Card
              key={plan}
              className={`bg-gray-900/50 backdrop-blur-xl border-gray-800 flex flex-col transition-all duration-300 ${
                plan === 'lite'
                  ? 'border-[#FF7600] shadow-lg shadow-[#FF7600]/10 scale-105 z-10'
                  : 'hover:border-gray-700'
              }`}
            >
              {plan === 'lite' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#FF7600] text-white hover:bg-[#FF7600]/90">
                    {t('popular')}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-white">{t(`plans.${plan}.name`)}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t(`plans.${plan}.description`)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Pro Tier Selector */}
                {plan === 'pro' && (
                  <div className="mb-4">
                    <Tabs
                      value={proTier}
                      onValueChange={(v) => setProTier(v as ProTier)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800 h-8">
                        {(['standard', 'turbo', 'max'] as ProTier[]).map((tierKey) => (
                          <TabsTrigger
                            key={tierKey}
                            value={tierKey}
                            className="data-[state=active]:bg-[#FF7600] data-[state=active]:text-white text-gray-400 text-xs px-2"
                          >
                            {t(`powerTiers.tiers.${tierKey}.name`)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{price}</span>
                  {plan !== 'free' && (
                    <>
                      <span className="text-gray-400 ml-2">
                        {pricingMode === 'monthly' ? t('monthly') : t('credit')}
                      </span>
                      {pricingMode === 'payAsYouGo' && (
                        <div className="mt-2">
                          <span
                            className="text-sm text-green-400 font-semibold block"
                            style={{
                              animation: 'pulse-green 2s ease-in-out infinite',
                            }}
                          >
                            {t('creditEqualsHours', { hours: pricing.creditHours })}
                          </span>
                          <span className="text-xs text-gray-500">{t('billingLegend')}</span>
                        </div>
                      )}
                      {(plan === 'lite' || plan === 'pro') && pricingMode === 'monthly' && (
                        <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0 h-5">
                          {t('perDesktop')}
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                <FeatureList plan={plan} t={t} planData={planDataFor(plan)} />
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${
                    plan === 'pro'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : plan === 'lite'
                        ? 'bg-[#FF7600] hover:bg-[#FF7600]/90 text-white'
                        : 'bg-transparent border border-gray-700 text-white hover:bg-gray-800'
                  }`}
                >
                  <a
                    href="https://app.cyqle.in/signup"
                    onClick={() =>
                      trackCTA.pricingPlan(plan, pricingMode, plan === 'pro' ? proTier : undefined)
                    }
                  >
                    {t(`plans.${plan}.cta`)}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* AI Credit Packs */}
      <div className="max-w-6xl mx-auto mb-10 rounded-lg border border-gray-800 bg-gray-900/30 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">{t('creditPacks.title')}</h3>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">{t('creditPacks.description')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {pricing.creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-lg border p-4 text-center ${
                pack.highlight ? 'border-[#FF7600] bg-[#FF7600]/5' : 'border-gray-800 bg-black/30'
              }`}
            >
              {pack.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7600] text-white hover:bg-[#FF7600]/90">
                  {t('creditPacks.bestValue')}
                </Badge>
              )}
              <p className="text-sm text-gray-400 mb-1">{t(`creditPacks.packs.${pack.id}.name`)}</p>
              <p className="text-2xl font-bold text-white">
                {t('creditPacks.packPrice', { price: pack.priceUSD })}
              </p>
              <p className="text-sm text-[#FF7600] font-semibold">
                {t('creditPacks.packCredits', { credits: pack.userCredits })}
              </p>
              {pack.approxTasks != null && (
                <p className="text-xs text-gray-500">
                  {t('creditPacks.packTasks', { tasks: pack.approxTasks })}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">{t('creditPacks.note')}</p>
      </div>

      {/* Custom Quote CTA */}
      <div className="max-w-6xl mx-auto mb-20 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-lg border border-dashed border-gray-700 bg-gray-900/30 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF7600]/10">
            <Users className="h-6 w-6 text-[#FF7600]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t('customQuote.heading')}</h3>
            <p className="text-sm text-gray-400">{t('customQuote.description')}</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setQuoteOpen(true);
            trackCTA.customQuoteOpen();
          }}
          className="bg-transparent border border-[#FF7600] text-[#FF7600] hover:bg-[#FF7600]/10 shrink-0"
        >
          {t('customQuote.cta')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Custom Quote Dialog */}
      <Dialog open={quoteOpen} onOpenChange={handleQuoteClose}>
        <DialogContent className="bg-gray-950 border-gray-800 sm:max-w-md">
          {quoteStatus === 'sent' ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <DialogHeader className="items-center">
                <DialogTitle className="text-white">{t('customQuote.successTitle')}</DialogTitle>
                <DialogDescription>{t('customQuote.successDescription')}</DialogDescription>
              </DialogHeader>
              <Button
                onClick={() => handleQuoteClose(false)}
                className="mt-2 bg-white text-black hover:bg-gray-200"
              >
                {t('customQuote.close')}
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{t('customQuote.dialogTitle')}</DialogTitle>
                <DialogDescription>{t('customQuote.dialogDescription')}</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  void handleQuoteSubmit(e);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-gray-300">
                    {t('customQuote.seatsLabel')}
                  </Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    required
                    value={quoteSeats}
                    onChange={(e) => setQuoteSeats(e.target.value)}
                    placeholder={t('customQuote.seatsPlaceholder')}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote-email" className="text-gray-300">
                    {t('customQuote.emailLabel')}
                  </Label>
                  <Input
                    id="quote-email"
                    type="email"
                    required
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder={t('customQuote.emailPlaceholder')}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                {quoteStatus === 'error' && (
                  <p className="text-sm text-red-400">{t('customQuote.errorMessage')}</p>
                )}
                <Button
                  type="submit"
                  disabled={quoteStatus === 'sending'}
                  className="w-full bg-[#FF7600] hover:bg-[#FF7600]/90 text-white"
                >
                  {quoteStatus === 'sending' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('customQuote.sending')}
                    </>
                  ) : (
                    t('customQuote.submit')
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeatureList({
  plan,
  t,
  planData,
}: {
  plan: PlanId;
  t: ReturnType<typeof useTranslations>;
  planData: PlanData;
}) {
  let features: Record<string, unknown> = {};
  try {
    features = t.raw(`plans.${plan}.features`) as Record<string, unknown>;
  } catch (e) {
    return null;
  }

  // Numbers come from the platform config (planData); the per-plan key list and
  // wording come from i18n. Every row receives the full bag — templates use what
  // they need, static strings ignore the rest.
  const bag = {
    minutes: planData.sessionMinutes,
    vcpu: planData.vcpu,
    ram: planData.ramGB,
    mbps: planData.bandwidthMbps,
    gb: planData.storageGB,
    credits: fmtCredits(planData.aiCreditsPerMonth),
  };

  const checkClass = `h-4 w-4 shrink-0 ${plan === 'lite' ? 'text-[#FF7600]' : 'text-gray-400'}`;
  const hasCredits = 'aiCredits' in features;

  return (
    <ul className="space-y-3">
      {Object.keys(features).map((feature) => {
        // The monthly credit allowance is shown as a badge on the agent row so
        // it's unambiguous the credits belong to the In-House AI Agent; the
        // standalone credits line is dropped.
        if (feature === 'aiCredits') return null;

        const content = t(`plans.${plan}.features.${feature}`, bag);

        if (feature === 'aiAgent' && hasCredits) {
          return (
            <li key={feature} className="flex items-center gap-2 text-gray-300">
              <Check className={checkClass} />
              <span>{content}</span>
              <CreditBadge
                label={t(`plans.${plan}.features.aiCredits`, bag)}
                tip={t('aiCreditsTooltip')}
              />
            </li>
          );
        }

        return (
          <li key={feature} className="flex items-center gap-3 text-gray-300">
            <Check className={checkClass} />
            <span>{content}</span>
          </li>
        );
      })}
    </ul>
  );
}

// Credit allowance shown as a badge on the agent row. Opens the explainer on
// hover, keyboard focus, and click/tap (click also toggles for touch, where
// hover doesn't exist); closes on outside click or Escape.
function CreditBadge({ label, tip }: { label: string; tip: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className="relative ml-auto inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex cursor-pointer items-center rounded-full border border-[#FF7600]/40 bg-[#FF7600]/10 px-2 py-0.5 text-xs font-semibold text-[#FF7600] transition-colors hover:bg-[#FF7600]/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7600]"
      >
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full right-0 z-50 mb-2 w-56 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-left text-xs font-normal leading-relaxed text-gray-200 shadow-lg"
        >
          {tip}
          <span className="absolute right-4 top-full h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-gray-700 bg-gray-950" />
        </span>
      )}
    </span>
  );
}
