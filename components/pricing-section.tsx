'use client';

import { useState } from 'react';
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

type Tier = 'basic' | 'standard' | 'turbo' | 'max';
type PricingMode = 'monthly' | 'payAsYouGo';

export default function PricingSection() {
  const t = useTranslations('pricing');
  const [proTier, setProTier] = useState<Tier>('standard');
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

  const plans = ['free', 'lite', 'pro'] as const;

  const getPrice = (plan: string) => {
    if (plan === 'free') return '$0.00';

    if (plan === 'lite') {
      return pricingMode === 'monthly' ? '$6' : '$0.20';
    }

    // Pro - uses proTier - Direct pricing per tier
    if (pricingMode === 'monthly') {
      const monthlyPricing = {
        standard: 12,
        turbo: 23,
        max: 45,
      };
      return `$${monthlyPricing[proTier]}`;
    } else {
      const creditPricing = {
        standard: 0.4,
        turbo: 0.77,
        max: 1.51,
      };
      return `$${creditPricing[proTier].toFixed(2)}`;
    }
  };

  const getTierForPlan = (plan: string): Tier => {
    if (plan === 'free' || plan === 'lite') return 'basic';
    return proTier;
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
        <p className="text-xl text-gray-400 mb-8">{t('description')}</p>

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
          const tier = getTierForPlan(plan);

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
                      onValueChange={(v) => setProTier(v as Tier)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800 h-8">
                        {(['standard', 'turbo', 'max'] as Tier[]).map((tierKey) => (
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
                            {t('creditEqualsHours')}
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

                <FeatureList plan={plan} t={t} selectedTier={tier} />
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

function FeatureList({ plan, t, selectedTier }: { plan: string; t: any; selectedTier: Tier }) {
  let features = {};
  try {
    features = t.raw(`plans.${plan}.features`);
  } catch (e) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {Object.keys(features).map((feature) => {
        // Skip the subscription feature as it's no longer needed
        if (feature === 'subscription') {
          return null;
        }

        let content = t(`plans.${plan}.features.${feature}`);

        // Dynamic overrides for Pro plan
        if (feature === 'specs' && plan === 'pro') {
          content = t(`powerTiers.tiers.${selectedTier}.specs`);
        }

        if (feature === 'persistence' && plan === 'pro') {
          content = t(`powerTiers.tiers.${selectedTier}.persistence`);
        }

        if (feature === 'bandwidth' && plan === 'pro') {
          content = t(`powerTiers.tiers.${selectedTier}.bandwidth`);
        }

        return (
          <li key={feature} className="flex items-center gap-3 text-gray-300">
            <Check
              className={`h-4 w-4 shrink-0 ${plan === 'lite' ? 'text-[#FF7600]' : 'text-gray-400'}`}
            />
            <span>{content}</span>
          </li>
        );
      })}
    </ul>
  );
}
