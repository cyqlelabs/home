import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AnimatedSection from '@/components/animated-section';
import ParallaxBackground from '@/components/parallax-background';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Cookie,
  Shield,
  Settings,
  Eye,
  ToggleLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
} from 'lucide-react';

type Props = {
  params: { locale: string };
};

export default async function CookiesPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('cookiesPolicy');

  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      {/* Hero Section */}
      <AnimatedSection className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <Cookie className="h-16 w-16 text-[#FF7600] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7600]/80 via-[#FF7600] to-[#FF7600]/80 mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">
            {t('lastUpdated')}: {t('effectiveDate')}
          </p>
          <p className="text-base text-slate-400 max-w-3xl mx-auto">{t('introduction')}</p>
        </div>
      </AnimatedSection>

      {/* 2026 Compliance Banner */}
      <AnimatedSection className="relative z-10 py-8 bg-gradient-to-r from-[#FF7600]/10 to-[#FF7600]/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <p className="text-white font-semibold text-lg">{t('complianceBanner')}</p>
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
                <Shield className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  {t('quickOverview.minimal.title')}
                </h3>
                <p className="text-sm text-gray-400">{t('quickOverview.minimal.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <ToggleLeft className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickOverview.gpc.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickOverview.gpc.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Eye className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{t('quickOverview.choice.title')}</h3>
                <p className="text-sm text-gray-400">{t('quickOverview.choice.description')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Settings className="h-8 w-8 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  {t('quickOverview.control.title')}
                </h3>
                <p className="text-sm text-gray-400">{t('quickOverview.control.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Content Sections */}
      <AnimatedSection className="relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Section 1: What Are Cookies */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Cookie className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.whatAreCookies.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.whatAreCookies.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.whatAreCookies.intro')}</p>
                <p className="text-sm">{t('sections.whatAreCookies.description')}</p>
              </div>
            </div>

            {/* Section 2: Cookies We Use */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Settings className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.cookiesWeUse.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.cookiesWeUse.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.cookiesWeUse.intro')}</p>

                <div className="bg-green-950/20 border border-green-900/50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-green-300">
                      {t('sections.cookiesWeUse.essential.title')}
                    </h3>
                  </div>
                  <p className="text-sm mb-3">{t('sections.cookiesWeUse.essential.intro')}</p>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded border border-green-900/30">
                      <p className="font-medium text-white text-sm mb-1">
                        {t('sections.cookiesWeUse.essential.session.name')}
                      </p>
                      <p className="text-xs mb-2">
                        {t('sections.cookiesWeUse.essential.session.purpose')}
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span>
                          <strong>{t('sections.cookiesWeUse.duration')}:</strong>{' '}
                          {t('sections.cookiesWeUse.essential.session.duration')}
                        </span>
                        <span>
                          <strong>{t('sections.cookiesWeUse.type')}:</strong>{' '}
                          {t('sections.cookiesWeUse.essential.session.type')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-3 italic text-green-200">
                    {t('sections.cookiesWeUse.essential.note')}
                  </p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">
                      {t('sections.cookiesWeUse.analytics.title')}
                    </h3>
                  </div>
                  <p className="text-sm mb-3">{t('sections.cookiesWeUse.analytics.intro')}</p>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-4 rounded border border-gray-600">
                      <p className="font-medium text-white text-sm mb-1">
                        {t('sections.cookiesWeUse.analytics.plausible.name')}
                      </p>
                      <p className="text-xs mb-2">
                        {t('sections.cookiesWeUse.analytics.plausible.purpose')}
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span>
                          <strong>{t('sections.cookiesWeUse.duration')}:</strong>{' '}
                          {t('sections.cookiesWeUse.analytics.plausible.duration')}
                        </span>
                        <span>
                          <strong>{t('sections.cookiesWeUse.type')}:</strong>{' '}
                          {t('sections.cookiesWeUse.analytics.plausible.type')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-3 italic text-blue-200">
                    {t('sections.cookiesWeUse.analytics.note')}
                  </p>
                </div>

                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <h3 className="font-semibold text-red-300">
                      {t('sections.cookiesWeUse.noTracking.title')}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      {t('sections.cookiesWeUse.noTracking.item1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      {t('sections.cookiesWeUse.noTracking.item2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      {t('sections.cookiesWeUse.noTracking.item3')}
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      {t('sections.cookiesWeUse.noTracking.item4')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: GPC Signal Support */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <ToggleLeft className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.gpcSupport.title')}
                  </h2>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {t('sections.gpcSupport.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.gpcSupport.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.gpcSupport.whatIsGpc.title')}
                  </h3>
                  <p className="text-sm">{t('sections.gpcSupport.whatIsGpc.description')}</p>
                </div>

                <div className="bg-green-950/20 border border-green-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-3">
                    {t('sections.gpcSupport.howItWorks.title')}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.gpcSupport.howItWorks.item1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.gpcSupport.howItWorks.item2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.gpcSupport.howItWorks.item3')}
                    </li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.gpcSupport.enable.title')}
                  </h3>
                  <p className="text-sm mb-3">{t('sections.gpcSupport.enable.description')}</p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>{t('sections.gpcSupport.enable.browser1')}</li>
                    <li>{t('sections.gpcSupport.enable.browser2')}</li>
                    <li>{t('sections.gpcSupport.enable.browser3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Cookie Banner Design */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Eye className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.cookieBanner.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.cookieBanner.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.cookieBanner.intro')}</p>

                <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {t('sections.cookieBanner.symmetry.title')}
                  </h3>
                  <p className="text-sm mb-4">{t('sections.cookieBanner.symmetry.description')}</p>

                  {/* Mock Cookie Banner Example */}
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-3 text-sm">
                      {t('sections.cookieBanner.symmetry.exampleTitle')}
                    </h4>
                    <p className="text-xs text-gray-400 mb-4">
                      {t('sections.cookieBanner.symmetry.exampleText')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                        {t('sections.cookieBanner.symmetry.acceptButton')}
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                        {t('sections.cookieBanner.symmetry.rejectButton')}
                      </button>
                    </div>
                    <button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-xs">
                      {t('sections.cookieBanner.symmetry.customizeButton')}
                    </button>
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.cookieBanner.requirements.title')}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.cookieBanner.requirements.item1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.cookieBanner.requirements.item2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.cookieBanner.requirements.item3')}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      {t('sections.cookieBanner.requirements.item4')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5: Managing Your Preferences */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Settings className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.managing.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.managing.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.managing.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.managing.changeMind.title')}
                  </h3>
                  <p className="text-sm">{t('sections.managing.changeMind.description')}</p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.managing.browserSettings.title')}
                  </h3>
                  <p className="text-sm mb-3">
                    {t('sections.managing.browserSettings.description')}
                  </p>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>
                      <strong>Chrome:</strong> {t('sections.managing.browserSettings.chrome')}
                    </li>
                    <li>
                      <strong>Firefox:</strong> {t('sections.managing.browserSettings.firefox')}
                    </li>
                    <li>
                      <strong>Safari:</strong> {t('sections.managing.browserSettings.safari')}
                    </li>
                    <li>
                      <strong>Edge:</strong> {t('sections.managing.browserSettings.edge')}
                    </li>
                  </ul>
                  <p className="text-xs mt-3 italic text-yellow-300">
                    {t('sections.managing.browserSettings.warning')}
                  </p>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.managing.deleteCookies.title')}
                  </h3>
                  <p className="text-sm">{t('sections.managing.deleteCookies.description')}</p>
                </div>
              </div>
            </div>

            {/* Section 6: Third-Party Services */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="h-8 w-8 text-[#FF7600] shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {t('sections.thirdParty.title')}
                  </h2>
                  <Badge variant="outline" className="border-[#FF7600] text-[#FF7600]">
                    {t('sections.thirdParty.badge')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>{t('sections.thirdParty.intro')}</p>

                <div className="bg-black/40 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-3">
                    {t('sections.thirdParty.plausible.title')}
                  </h3>
                  <p className="text-sm mb-2">{t('sections.thirdParty.plausible.description')}</p>
                  <a
                    href="https://plausible.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF7600] hover:text-[#FF8C33] text-sm underline"
                  >
                    {t('sections.thirdParty.plausible.link')}
                  </a>
                </div>
              </div>
            </div>

            {/* Section 7: Changes & Updates */}
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
