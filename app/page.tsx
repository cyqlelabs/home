import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Cloud,
  Zap,
  Users,
  TestTube,
  Headset,
  PlugIcon as Pipeline,
  Bot,
  Lock,
} from 'lucide-react';
import ParallaxBackground from '@/components/parallax-background';
import FeatureCard from '@/components/feature-card';
import AnimatedSection from '@/components/animated-section';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MoreInfoButton from '@/components/more-info-button';
import ResponsiveVideo from '@/components/responsive-video';
import { LanguageProvider } from '@/components/language-provider';
// Import the English messages directly for static generation
import messages from '@/i18n/messages/en/index.json';

// Force static generation
export const dynamic = 'force-static';

export default function RootPage() {
  const locale = 'en';

  // Use hardcoded English translations for static generation
  const heroT = (key: string) => messages.hero[key as keyof typeof messages.hero];
  const featuresT = (key: string) => {
    const keys = key.split('.');
    let value: any = messages.features;
    for (const k of keys) {
      value = value[k];
    }
    return value;
  };
  const useCasesT = (key: string) => {
    const keys = key.split('.');
    let value: any = messages.useCases;
    for (const k of keys) {
      value = value[k];
    }
    return value;
  };
  const aiSectionT = (key: string) => {
    if (key === 'items') return messages.aiSection.items;
    return messages.aiSection[key as keyof typeof messages.aiSection];
  };
  aiSectionT.raw = (key: string) => {
    if (key === 'items') return messages.aiSection.items;
    return messages.aiSection[key as keyof typeof messages.aiSection];
  };
  const testimonialsT = (key: string) => {
    if (key === 'items') return messages.testimonials.items;
    return messages.testimonials[key as keyof typeof messages.testimonials];
  };
  testimonialsT.raw = (key: string) => {
    if (key === 'items') return messages.testimonials.items;
    return messages.testimonials[key as keyof typeof messages.testimonials];
  };
  const ctaT = (key: string) => messages.cta[key as keyof typeof messages.cta];

  return (
    <LanguageProvider locale={locale}>
      <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
        <ParallaxBackground />
        <Navbar />

        {/* Hero Section */}
        <AnimatedSection className="relative z-10 min-h-screen overflow-hidden flex items-center">
          <ResponsiveVideo
            desktopSrc="/vid2.mp4"
            mobileSrc="/vid2-p.mp4"
            className="absolute top-0 left-0 w-full h-full object-cover dark:opacity-[.15] opacity-15 -z-10"
          />
          <div className="container bg-clip-text mx-auto px-4 pt-32 pb-20 flex flex-col items-center gap-6 text-center dark:bg-transparent bg-gray-100 bg-opacity-80">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-500 to-purple-600 mb-6">
              {heroT('title')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-orange-400 font-semibold max-w-4xl">
              {(() => {
                const desc = heroT('description').split('.');

                return (
                  <>
                    {desc[0]}.
                    <br />
                    {desc[1]}.
                  </>
                );
              })()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <MoreInfoButton>{heroT('moreInfo')}</MoreInfoButton>
              <Button disabled={true} size="lg" variant="outline" className="border-gray-700">
                {heroT('bookDemo')}
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-black/80 to-gray-900/80 dark:bg-clip-text">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-foreground text-gray-400">
              {featuresT('title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bot className="h-10 w-10 text-purple-400" />}
                title={featuresT('aiAutomation.title')}
                description={featuresT('aiAutomation.description')}
              />
              <FeatureCard
                icon={<Cloud className="h-10 w-10 text-cyan-400" />}
                title={featuresT('cloudNative.title')}
                description={featuresT('cloudNative.description')}
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-purple-400" />}
                title={featuresT('collaboration.title')}
                description={featuresT('collaboration.description')}
              />
              <FeatureCard
                icon={<TestTube className="h-10 w-10 text-cyan-400" />}
                title={featuresT('testing.title')}
                description={featuresT('testing.description')}
              />
              <FeatureCard
                icon={<Headset className="h-10 w-10 text-purple-400" />}
                title={featuresT('support.title')}
                description={featuresT('support.description')}
              />
              <FeatureCard
                icon={<Pipeline className="h-10 w-10 text-cyan-400" />}
                title={featuresT('pipelines.title')}
                description={featuresT('pipelines.description')}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Use Cases Section */}
        <AnimatedSection className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              {useCasesT('title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Cyqle dashboard interface"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">{useCasesT('development.title')}</h3>
                  </div>
                  <p className="text-gray-400">{useCasesT('development.description')}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-cyan-500/20 p-2 rounded-lg mr-4">
                      <TestTube className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">{useCasesT('qa.title')}</h3>
                  </div>
                  <p className="text-gray-400">{useCasesT('qa.description')}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                      <Headset className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">{useCasesT('customerSupport.title')}</h3>
                  </div>
                  <p className="text-gray-400">{useCasesT('customerSupport.description')}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-cyan-500/20 p-2 rounded-lg mr-4">
                      <Zap className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">{useCasesT('operations.title')}</h3>
                  </div>
                  <p className="text-gray-400">{useCasesT('operations.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

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
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-4 w-4 text-black" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  {aiSectionT('exploreFeatures')}
                </Button>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="AI automation interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
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
                  className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                >
                  <p className="text-white dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-gray-100 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="relative z-10 py-20 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{ctaT('title')}</h2>
            <p className="text-xl dark:text-gray-300 text-white max-w-3xl mx-auto mb-10">
              {ctaT('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {ctaT('startTrial')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 hover:text-gray-100"
              >
                {ctaT('scheduleDemo')}
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
    </LanguageProvider>
  );
}
