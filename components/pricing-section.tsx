'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Check, X as XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Tier = 'basic' | 'standard' | 'turbo' | 'max';
type PricingMode = 'monthly' | 'payAsYouGo';

const TIERS: Record<Tier, { name: string; specs: string; multiplier: number }> = {
  basic: { name: 'Basic', specs: '1 vCPU / 1 GB', multiplier: 0 },
  standard: { name: 'Standard', specs: '2 vCPU / 4 GB', multiplier: 1 },
  turbo: { name: 'Turbo', specs: '4 vCPU / 8 GB', multiplier: 2 },
  max: { name: 'Max', specs: '8 vCPU / 16 GB', multiplier: 4 },
};

export default function PricingSection() {
  const t = useTranslations('pricing');
  const [selectedTier, setSelectedTier] = useState<Tier>('basic');
  const [pricingMode, setPricingMode] = useState<PricingMode>('monthly');

  const plans = ['free', 'lite', 'pro'] as const;

  const getPrice = (plan: string, tier: Tier) => {
    if (plan === 'free') return '$0.00';

    if (plan === 'lite') {
      if (tier === 'basic') {
        return pricingMode === 'monthly' ? '$10' : '$0.05';
      }
      return 'N/A';
    }

    // Pro
    if (tier === 'basic') return 'N/A';

    if (pricingMode === 'monthly') {
      // Monthly subscription pricing
      const baseMonthly = 20;
      const multiplier = TIERS[tier].multiplier;
      return `$${baseMonthly * multiplier}`;
    } else {
      // Pay-as-you-go pricing
      const basePro = 0.3;
      const multiplier = TIERS[tier].multiplier;
      return `$${(basePro * multiplier).toFixed(2)}`;
    }
  };

  const isPlanAvailable = (plan: string, tier: Tier) => {
    if (plan === 'free') return tier === 'basic';
    if (plan === 'lite') return tier === 'basic';
    if (plan === 'pro') return tier !== 'basic';
    return false;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
        <p className="text-xl text-gray-400 mb-8">{t('description')}</p>

        {/* Pricing Mode Toggle */}
        <div className="flex justify-center mb-6">
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
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="payAsYouGo"
                className="data-[state=active]:bg-[#FF7600] data-[state=active]:text-white text-gray-400"
              >
                Pay as You Go
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tier Selector */}
        <div className="flex justify-center mb-12">
          <Tabs
            value={selectedTier}
            onValueChange={(v) => setSelectedTier(v as Tier)}
            className="w-full max-w-2xl"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
              {(Object.keys(TIERS) as Tier[]).map((tierKey) => (
                <TabsTrigger
                  key={tierKey}
                  value={tierKey}
                  className="data-[state=active]:bg-[#FF7600] data-[state=active]:text-white text-gray-400"
                >
                  <div className="flex flex-col items-center py-1">
                    <span className="font-bold">{TIERS[tierKey].name}</span>
                    <span className="text-xs opacity-80">{TIERS[tierKey].specs}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {plans.map((plan) => {
          const available = isPlanAvailable(plan, selectedTier);
          const price = getPrice(plan, selectedTier);

          // Reorder Pro to top on mobile if a high-performance tier is selected
          const orderClass =
            plan === 'pro' && selectedTier !== 'basic' ? 'order-first md:order-none' : '';

          return (
            <Card
              key={plan}
              className={`bg-gray-900/50 border-gray-800 flex flex-col transition-all duration-300 ${orderClass} ${
                available
                  ? plan === 'lite'
                    ? 'border-[#FF7600] shadow-lg shadow-[#FF7600]/10 scale-105 z-10'
                    : 'hover:border-gray-700'
                  : 'opacity-50 grayscale border-transparent'
              }`}
            >
              {' '}
              {plan === 'lite' && available && (
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
                <div className="mb-6">
                  {available ? (
                    <>
                      <span className="text-4xl font-bold text-white">{price}</span>
                      {plan !== 'free' && (
                        <>
                          <span className="text-gray-400 ml-2">
                            {pricingMode === 'monthly' ? '/month' : '/hour'}
                          </span>
                          {pricingMode === 'payAsYouGo' && (
                            <span className="text-xs text-gray-500 pl-2">{t('billingLegend')}</span>
                          )}
                          {(plan === 'lite' || plan === 'pro') && (
                            <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0 h-5">
                              {t('perDesktop')}
                            </Badge>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">Not Available</span>
                  )}
                </div>

                <FeatureList
                  plan={plan}
                  t={t}
                  selectedTier={selectedTier}
                  isAvailable={available}
                />
              </CardContent>
              <CardFooter>
                <Button
                  disabled={!available}
                  className={`w-full ${
                    available
                      ? plan === 'pro'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : plan === 'lite'
                          ? 'bg-[#FF7600] hover:bg-[#FF7600]/90 text-white'
                          : 'bg-transparent border border-gray-700 text-white hover:bg-gray-800'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t(`plans.${plan}.cta`)}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FeatureList({
  plan,
  t,
  selectedTier,
  isAvailable,
}: {
  plan: string;
  t: any;
  selectedTier: Tier;
  isAvailable: boolean;
}) {
  // Hacky way to get keys since t.raw might be restricted or typed
  // We can try to retrieve the object.
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

        // Dynamic overrides
        if (feature === 'specs') {
          if (plan === 'pro' && isAvailable) {
            content = TIERS[selectedTier].specs;
          } else if ((plan === 'free' || plan === 'lite') && !isAvailable) {
            // Keep the static content (1 vCPU / 1 GB) as fallback/explanation
          }
        }

        if (feature === 'persistence') {
          if (plan === 'pro' && isAvailable) {
            content = t(`powerTiers.tiers.${selectedTier}.persistence`);
          }
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
