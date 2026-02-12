import { Button } from '@/components/ui/button';
import { type Metadata } from 'next';
import {
  ChevronRight,
  Zap,
  Users,
  TestTube,
  Headset,
  Bot,
  Lock,
  Terminal,
  Briefcase,
  Smartphone,
} from 'lucide-react';
import ParallaxBackground from '@/components/parallax-background';
import FeatureCard from '@/components/feature-card';
import AnimatedSection from '@/components/animated-section';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MoreInfoButton from '@/components/more-info-button';
import PowerOnButton from '@/components/power-on-button';
import ResponsiveVideo from '@/components/responsive-video';
import RotatingPhrase from '@/components/rotating-phrase';
import HeroBackground from '@/components/hero-background';
import PricingSection from '@/components/pricing-section';
import TrackedLink from '@/components/tracked-link';
import TrackedButton from '@/components/tracked-button';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getSEOAlternates, type SiteLocale } from '@/lib/site-metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const alternates = getSEOAlternates(locale as SiteLocale, '/');
  return {
    alternates,
  };
}

export default async function Home({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Get translations
  const heroT = await getTranslations('hero');
  const featuresT = await getTranslations('features');
  const tUseCases = await getTranslations('useCases');
  const aiSectionT = await getTranslations('aiSection');
  const testimonialsT = await getTranslations('testimonials');
  const ctaT = await getTranslations('cta');

  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />
      <AnimatedSection className="relative z-10 min-h-screen overflow-hidden flex items-center">
        <HeroBackground />
        <div className="container bg-clip-text mx-auto px-4 pt-32 pb-20 flex flex-col items-center gap-6 text-center dark:bg-transparent bg-gray-100 bg-opacity-80">
          <div className="h-[8rem] sm:h-[6rem] md:h-[7rem] flex items-center justify-center w-full px-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#FF7600]">
              <RotatingPhrase
                phrases={[heroT('titlePhrase1'), heroT('titlePhrase2'), heroT('titlePhrase3')]}
                className="text-[#FF7600]"
              />
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-10 text-slate-200 font-semibold max-w-4xl mt-2 [text-wrap:balance]">
            {heroT('description')}
          </p>
          <div className="flex flex-col items-center gap-10">
            <PowerOnButton />
            <div className="flex flex-col sm:flex-row gap-3">
              <MoreInfoButton>{heroT('moreInfo')}</MoreInfoButton>
              <Button asChild size="sm" className="bg-black text-white hover:bg-gray-900 shadow-lg">
                <TrackedLink
                  href="mailto:demo@cyqle.in"
                  trackingKey="bookDemo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {heroT('bookDemo')}
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
      <div id="features" />
      {/* Features Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-black/80 to-gray-900/80 dark:bg-clip-text">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-foreground text-gray-400">
            {featuresT('title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-[#FF7600]" />}
              title={featuresT('multiplayerDesktop.title')}
              description={featuresT('multiplayerDesktop.description')}
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-gray-300" />}
              title={featuresT('ephemeralEnvironments.title')}
              description={featuresT('ephemeralEnvironments.description')}
            />
            <FeatureCard
              icon={<Terminal className="h-10 w-10 text-gray-400" />}
              title={featuresT('unrestrictedAccess.title')}
              description={featuresT('unrestrictedAccess.description')}
            />
            <FeatureCard
              icon={<Bot className="h-10 w-10 text-[#FF7600]" />}
              title={featuresT('workflowAutomation.title')}
              description={featuresT('workflowAutomation.description')}
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10 text-gray-300" />}
              title={featuresT('zeroKnowledgeSecurity.title')}
              description={featuresT('zeroKnowledgeSecurity.description')}
            />
            <FeatureCard
              icon={<Smartphone className="h-10 w-10 text-[#FF7600]" />}
              title={featuresT('mobileAccess.title')}
              description={featuresT('mobileAccess.description')}
            />
          </div>
        </div>
      </AnimatedSection>
      <div id="useCases" />
      {/* Use Cases Section */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{tUseCases('title')}</h2>
        </div>
        <div className="mx-auto md:px-4 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:gap-0 items-center">
            <div className="md:rounded-xl overflow-hidden shadow-2xl shadow-[#FF7600]/10">
              <ResponsiveVideo
                desktopSrc="/Cyqle-multi-web.mp4"
                mobileSrc="/Cyqle-multi-web.mp4"
                className="w-full h-full"
              />
            </div>
            <div className="space-y-4 px-4 md:px-0">
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="bg-gray-500/20 p-1.5 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold">{tUseCases('development.title')}</h3>
                </div>
                <p className="text-gray-400">{tUseCases('development.description')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="bg-[#FF7600]/20 p-1.5 rounded-lg mr-3">
                    <TestTube className="h-5 w-5 text-[#FF7600]" />
                  </div>
                  <h3 className="text-lg font-semibold">{tUseCases('qa.title')}</h3>
                </div>
                <p className="text-gray-400">{tUseCases('qa.description')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="bg-gray-500/20 p-1.5 rounded-lg mr-3">
                    <Headset className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{tUseCases('customerSupport.title')}</h3>
                </div>
                <p className="text-gray-400">{tUseCases('customerSupport.description')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="bg-[#FF7600]/20 p-1.5 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-[#FF7600]" />
                  </div>
                  <h3 className="text-lg font-semibold">{tUseCases('operations.title')}</h3>
                </div>
                <p className="text-gray-400">{tUseCases('operations.description')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="bg-gray-500/20 p-1.5 rounded-lg mr-3">
                    <Briefcase className="h-5 w-5 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold">{tUseCases('admin.title')}</h3>
                </div>
                <p className="text-gray-400">{tUseCases('admin.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      <div id="ai" />
      {/* AI Automation Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-gray-900/80 to-black/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-300 dark:text-foreground">
                {aiSectionT('title')}
              </h2>
              <p className="text-gray-300 text-lg">{aiSectionT('description')}</p>
              <ul className="space-y-4">
                {aiSectionT.raw('items').map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-gradient-to-r from-orange-300 to-[#FF7600] rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 bg-gradient-to-r from-[#005a73] via-[#007B9C] to-[#005a73] text-white hover:from-[#004a5f] hover:via-[#006380] hover:to-[#004a5f] shadow-lg"
              >
                <TrackedLink href={`/${locale}#features`} trackingKey="exploreFeatures">
                  {aiSectionT('exploreFeatures')}
                </TrackedLink>
              </Button>
            </div>
            <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-2xl shadow-[#FF7600]/10">
              <ResponsiveVideo
                desktopSrc="/demo1.mp4"
                mobileSrc="/demo1.mp4"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
      <div id="pricing" />
      {/* Pricing Section */}
      <AnimatedSection className="relative z-10 py-20">
        <PricingSection />
      </AnimatedSection>
      {/* Testimonials */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {testimonialsT('title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsT.raw('items').map((testimonial: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-xl border border-gray-800 hover:border-[#FF7600]/50 transition-all duration-300 relative"
              >
                {testimonial.metric && (
                  <div className="absolute top-4 right-4 bg-[#FF7600]/10 border border-[#FF7600]/30 rounded-lg px-3 py-1">
                    <p className="text-[#FF7600] text-xs font-semibold">{testimonial.metric}</p>
                  </div>
                )}
                <p className="text-white dark:text-gray-300 mb-6 italic leading-relaxed mt-12">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="border-t border-gray-700 pt-4">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-gray-400 text-sm mt-1">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
      {/* CTA Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-r from-gray-900/30 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{ctaT('title')}</h2>
          <p className="text-xl dark:text-gray-300 text-white max-w-3xl mx-auto mb-10 whitespace-pre-line">
            {ctaT('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackedButton
              size="lg"
              className="bg-gradient-to-r from-[#005a73] via-[#007B9C] to-[#005a73] text-white hover:from-[#004a5f] hover:via-[#006380] hover:to-[#004a5f] shadow-lg"
              trackingKey="ctaStartTrial"
              href="https://app.cyqle.in"
            >
              {ctaT('startTrial')}
            </TrackedButton>
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-900 shadow-lg">
              <TrackedLink
                href="mailto:demo@cyqle.in"
                trackingKey="ctaScheduleDemo"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ctaT('scheduleDemo')}
              </TrackedLink>
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <Lock className="h-5 w-5 dark:text-gray-400 text-gray-600 mr-2" />
            <p className="dark:text-gray-400 text-gray-600">{ctaT('trialInfo')}</p>
          </div>
        </div>
      </AnimatedSection>
      <Footer />
    </div>
  );
}

// Generate static params for each locale
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
