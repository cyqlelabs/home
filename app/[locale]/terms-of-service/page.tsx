import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Metadata } from 'next';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';
import { Scale, Shield, FileText, AlertCircle, Copyright, Ban, Users, Clock } from 'lucide-react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'termsOfService' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/terms-of-service');
  return {
    title: t('title'),
    description: t('introduction'),
    alternates,
  };
}

export default async function TermsOfServicePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('termsOfService');

  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      {/* Hero Section */}
      <AnimatedSection className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <Scale className="h-16 w-16 text-[#FF7600] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7600]/80 via-[#FF7600] to-[#FF7600]/80 mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">
            {t('lastUpdated')}: {t('effectiveDate')}
          </p>
          <p className="text-base text-slate-400 max-w-3xl mx-auto">{t('introduction')}</p>
        </div>
      </AnimatedSection>

      {/* Quick Summary Section */}
      <AnimatedSection className="relative z-10 py-12 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
            {t('quickSummary.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickSummary.license.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickSummary.license.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickSummary.slots.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickSummary.slots.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  {t('quickSummary.liability.title')}
                </h3>
                <p className="text-sm text-gray-400">{t('quickSummary.liability.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Ban className="h-8 w-8 text-red-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickSummary.conduct.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickSummary.conduct.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Content Sections */}
      <AnimatedSection className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Section 1: License & Scope */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.license.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.license.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.license.intro')}</p>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.license.grant.title')}
                  </h3>
                  <p className="mb-4">{t('sections.license.grant.description')}</p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.license.grant.point1')}</li>
                    <li>{t('sections.license.grant.point2')}</li>
                    <li>{t('sections.license.grant.point3')}</li>
                    <li>{t('sections.license.grant.point4')}</li>
                  </ul>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.license.fairUse.title')}
                  </h3>
                  <p className="mb-4">{t('sections.license.fairUse.description')}</p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.license.fairUse.prohibited1')}</li>
                    <li>{t('sections.license.fairUse.prohibited2')}</li>
                    <li>{t('sections.license.fairUse.prohibited3')}</li>
                    <li>{t('sections.license.fairUse.prohibited4')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Subscription & Slot Model */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Users className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.subscription.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.subscription.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.subscription.intro')}</p>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.subscription.slotModel.title')}
                  </h3>
                  <p className="mb-4">{t('sections.subscription.slotModel.description')}</p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.subscription.slotModel.point1')}</li>
                    <li>{t('sections.subscription.slotModel.point2')}</li>
                    <li>{t('sections.subscription.slotModel.point3')}</li>
                  </ul>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.subscription.tiers.title')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-white">
                        {t('sections.subscription.tiers.free.name')}
                      </p>
                      <p className="text-sm">{t('sections.subscription.tiers.free.description')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {t('sections.subscription.tiers.paid.name')}
                      </p>
                      <p className="text-sm">{t('sections.subscription.tiers.paid.description')}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.subscription.billing.title')}
                  </h3>
                  <p className="text-sm">{t('sections.subscription.billing.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Acceptable Use Policy */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Ban className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.acceptableUse.title')}
                  </h2>
                  <Badge variant="outline" className="border-red-500 text-red-400">
                    {t('sections.acceptableUse.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.acceptableUse.intro')}</p>
                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {t('sections.acceptableUse.prohibited.title')}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.acceptableUse.prohibited.item1')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item2')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item3')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item4')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item5')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item6')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item7')}</li>
                    <li>{t('sections.acceptableUse.prohibited.item8')}</li>
                  </ul>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.acceptableUse.enforcement.title')}
                  </h3>
                  <p className="text-sm">{t('sections.acceptableUse.enforcement.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Limitation of Liability */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.liability.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.liability.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.liability.disclaimer.title')}
                  </h3>
                  <p className="text-sm uppercase mb-3 text-yellow-400">
                    {t('sections.liability.disclaimer.warning')}
                  </p>
                  <p className="text-sm">{t('sections.liability.disclaimer.description')}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.liability.limitationAmount.title')}
                  </h3>
                  <p className="text-sm">{t('sections.liability.limitationAmount.description')}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.liability.thirdParty.title')}
                  </h3>
                  <p className="text-sm">{t('sections.liability.thirdParty.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 5: Intellectual Property */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Copyright className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.intellectualProperty.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.intellectualProperty.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.intellectualProperty.intro')}</p>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.intellectualProperty.cyqleOwnership.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.intellectualProperty.cyqleOwnership.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.intellectualProperty.cyqleOwnership.item1')}</li>
                    <li>{t('sections.intellectualProperty.cyqleOwnership.item2')}</li>
                    <li>{t('sections.intellectualProperty.cyqleOwnership.item3')}</li>
                    <li>{t('sections.intellectualProperty.cyqleOwnership.item4')}</li>
                  </ul>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.intellectualProperty.userOwnership.title')}
                  </h3>
                  <p className="text-sm">
                    {t('sections.intellectualProperty.userOwnership.description')}
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.intellectualProperty.dataRetention.title')}
                  </h3>
                  <p className="text-sm">
                    {t('sections.intellectualProperty.dataRetention.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Termination */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Clock className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.termination.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.termination.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.termination.intro')}</p>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.termination.byUser.title')}
                  </h3>
                  <p className="text-sm">{t('sections.termination.byUser.description')}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.termination.byCyqle.title')}
                  </h3>
                  <p className="text-sm">{t('sections.termination.byCyqle.description')}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.termination.effect.title')}
                  </h3>
                  <p className="text-sm">{t('sections.termination.effect.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 7: Changes to Terms */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('sections.changes.title')}</h2>
              <p className="text-gray-300">{t('sections.changes.description')}</p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#FF7600]/10 to-[#FF7600]/5 border border-[#FF7600]/30 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">{t('contact.title')}</h2>
              <p className="text-gray-300 mb-4">{t('contact.description')}</p>
              <a
                href="mailto:legal@cyqle.in"
                className="text-[#FF7600] font-semibold hover:text-[#FF8C33] transition-colors"
              >
                {t('contact.email')}
              </a>
            </div>
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
