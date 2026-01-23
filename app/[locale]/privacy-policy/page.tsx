import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Metadata } from 'next';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';
import {
  Shield,
  Lock,
  Database,
  Eye,
  Server,
  Globe,
  Trash2,
  Bell,
  FileText,
  Bot,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });
  const alternates = getSEOAlternates(locale as SiteLocale, '/privacy-policy');
  return {
    title: t('title'),
    description: t('introduction'),
    alternates,
  };
}

export default async function PrivacyPolicyPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('privacyPolicy');

  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      {/* Hero Section */}
      <AnimatedSection className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-[#FF7600] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7600]/80 via-[#FF7600] to-[#FF7600]/80 mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">
            {t('lastUpdated')}: {t('effectiveDate')}
          </p>
          <p className="text-base text-slate-400 max-w-3xl mx-auto">{t('introduction')}</p>
        </div>
      </AnimatedSection>

      {/* Privacy 3.0 Banner */}
      <AnimatedSection className="relative z-10 py-8 bg-gradient-to-r from-[#FF7600]/10 to-[#FF7600]/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <p className="text-white font-semibold text-lg">{t('privacy3Banner')}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Quick Overview */}
      <AnimatedSection className="relative z-10 py-12 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
            {t('quickOverview.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Lock className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  {t('quickOverview.ephemeral.title')}
                </h3>
                <p className="text-sm text-gray-400">{t('quickOverview.ephemeral.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Bot className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  {t('quickOverview.aiTransparency.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {t('quickOverview.aiTransparency.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Globe className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickOverview.p2p.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickOverview.p2p.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Eye className="h-8 w-8 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickOverview.rights.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickOverview.rights.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Content Sections */}
      <AnimatedSection className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Section 1: Data Collection & Legal Basis */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Database className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.dataCollection.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.dataCollection.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.dataCollection.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.dataCollection.accountData.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.dataCollection.accountData.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.dataCollection.accountData.item1')}</li>
                    <li>{t('sections.dataCollection.accountData.item2')}</li>
                    <li>{t('sections.dataCollection.accountData.item3')}</li>
                    <li>{t('sections.dataCollection.accountData.item4')}</li>
                  </ul>
                  <p className="mt-3 text-sm italic text-blue-300">
                    {t('sections.dataCollection.accountData.legalBasis')}
                  </p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.dataCollection.sessionData.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.dataCollection.sessionData.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.dataCollection.sessionData.item1')}</li>
                    <li>{t('sections.dataCollection.sessionData.item2')}</li>
                    <li>{t('sections.dataCollection.sessionData.item3')}</li>
                    <li>{t('sections.dataCollection.sessionData.item4')}</li>
                  </ul>
                  <p className="mt-3 text-sm italic text-blue-300">
                    {t('sections.dataCollection.sessionData.legalBasis')}
                  </p>
                  <div className="mt-4 p-3 bg-green-950/30 border border-green-900/50 rounded">
                    <p className="text-sm text-green-300">
                      {t('sections.dataCollection.sessionData.ephemeralNote')}
                    </p>
                  </div>
                  <div className="mt-4 p-4 bg-blue-950/30 border-2 border-blue-500/50 rounded-lg">
                    <p className="text-sm text-blue-200 font-semibold">
                      {t('sections.dataCollection.sessionData.noAccessNote')}
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.dataCollection.technicalData.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.dataCollection.technicalData.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.dataCollection.technicalData.item1')}</li>
                    <li>{t('sections.dataCollection.technicalData.item2')}</li>
                    <li>{t('sections.dataCollection.technicalData.item3')}</li>
                  </ul>
                  <p className="mt-3 text-sm italic text-blue-300">
                    {t('sections.dataCollection.technicalData.legalBasis')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: AI Transparency */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Bot className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.aiTransparency.title')}
                  </h2>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {t('sections.aiTransparency.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.aiTransparency.intro')}</p>

                <div className="bg-purple-950/20 border border-purple-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {t('sections.aiTransparency.disclosure.title')}
                  </h3>
                  <p className="text-sm mb-3">
                    {t('sections.aiTransparency.disclosure.description')}
                  </p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.aiTransparency.howItWorks.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.aiTransparency.howItWorks.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.aiTransparency.howItWorks.item1')}</li>
                    <li>{t('sections.aiTransparency.howItWorks.item2')}</li>
                    <li>{t('sections.aiTransparency.howItWorks.item3')}</li>
                    <li>{t('sections.aiTransparency.howItWorks.item4')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.aiTransparency.humanOversight.title')}
                  </h3>
                  <p className="text-sm">
                    {t('sections.aiTransparency.humanOversight.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Automated Decision-Making */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Server className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.automatedDecisions.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.automatedDecisions.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.automatedDecisions.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.automatedDecisions.systems.title')}
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <strong className="text-white">
                        {t('sections.automatedDecisions.systems.fraud.title')}
                      </strong>
                      <p>{t('sections.automatedDecisions.systems.fraud.description')}</p>
                    </li>
                    <li>
                      <strong className="text-white">
                        {t('sections.automatedDecisions.systems.allocation.title')}
                      </strong>
                      <p>{t('sections.automatedDecisions.systems.allocation.description')}</p>
                    </li>
                    <li>
                      <strong className="text-white">
                        {t('sections.automatedDecisions.systems.abuse.title')}
                      </strong>
                      <p>{t('sections.automatedDecisions.systems.abuse.description')}</p>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-3">
                    {t('sections.automatedDecisions.optOut.title')}
                  </h3>
                  <p className="text-sm mb-3">
                    {t('sections.automatedDecisions.optOut.description')}
                  </p>
                  <p className="text-sm italic">
                    {t('sections.automatedDecisions.optOut.contact')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: International Transfers */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Globe className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.internationalTransfers.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.internationalTransfers.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.internationalTransfers.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.internationalTransfers.p2pNature.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.internationalTransfers.p2pNature.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.internationalTransfers.p2pNature.item1')}</li>
                    <li>{t('sections.internationalTransfers.p2pNature.item2')}</li>
                    <li>{t('sections.internationalTransfers.p2pNature.item3')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.internationalTransfers.safeguards.title')}
                  </h3>
                  <p className="mb-3 text-sm">
                    {t('sections.internationalTransfers.safeguards.description')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.internationalTransfers.safeguards.item1')}</li>
                    <li>{t('sections.internationalTransfers.safeguards.item2')}</li>
                    <li>{t('sections.internationalTransfers.safeguards.item3')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.internationalTransfers.accountability.title')}
                  </h3>
                  <p className="text-sm">
                    {t('sections.internationalTransfers.accountability.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Data Retention & Deletion */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Trash2 className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.retention.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.retention.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.retention.intro')}</p>

                <div className="bg-green-950/20 border border-green-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-3">
                    {t('sections.retention.ephemeral.title')}
                  </h3>
                  <p className="mb-3 text-sm">{t('sections.retention.ephemeral.description')}</p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.retention.ephemeral.item1')}</li>
                    <li>{t('sections.retention.ephemeral.item2')}</li>
                    <li>{t('sections.retention.ephemeral.item3')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.retention.persistent.title')}
                  </h3>
                  <p className="mb-3 text-sm">{t('sections.retention.persistent.description')}</p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.retention.persistent.item1')}</li>
                    <li>{t('sections.retention.persistent.item2')}</li>
                    <li>{t('sections.retention.persistent.item3')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.retention.accountData.title')}
                  </h3>
                  <p className="text-sm">{t('sections.retention.accountData.description')}</p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.retention.deletion.title')}
                  </h3>
                  <p className="text-sm">{t('sections.retention.deletion.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 6: Your Rights */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Eye className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.rights.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.rights.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.rights.intro')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.access.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.access.description')}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.rectification.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.rectification.description')}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.erasure.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.erasure.description')}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.portability.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.portability.description')}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.objection.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.objection.description')}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      {t('sections.rights.restriction.title')}
                    </h4>
                    <p className="text-xs">{t('sections.rights.restriction.description')}</p>
                  </div>
                </div>

                <div className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-lg mt-4">
                  <p className="text-sm">{t('sections.rights.exercise')}</p>
                </div>
              </div>
            </div>

            {/* Section 7: Security Measures */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.security.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.security.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.security.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.security.measures.title')}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>{t('sections.security.measures.item1')}</li>
                    <li>{t('sections.security.measures.item2')}</li>
                    <li>{t('sections.security.measures.item3')}</li>
                    <li>{t('sections.security.measures.item4')}</li>
                    <li>{t('sections.security.measures.item5')}</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.security.breach.title')}
                  </h3>
                  <p className="text-sm">{t('sections.security.breach.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 8: Cookies & Tracking */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.cookies.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.cookies.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.cookies.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.cookies.essential.title')}
                  </h3>
                  <p className="text-sm">{t('sections.cookies.essential.description')}</p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.cookies.analytics.title')}
                  </h3>
                  <p className="text-sm">{t('sections.cookies.analytics.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 9: Changes & Updates */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Bell className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.changes.title')}
                  </h2>
                </div>
              </div>
              <p className="text-gray-300">{t('sections.changes.description')}</p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#FF7600]/10 to-[#FF7600]/5 border border-[#FF7600]/30 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">{t('contact.title')}</h2>
              <p className="text-gray-300 mb-4">{t('contact.description')}</p>
              <a
                href="mailto:privacy@cyqle.in"
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
