import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingCard from '@/components/PricingCard'
import HeroDemo from '@/components/HeroDemo'
import { Shield, Brain, FileSearch, BarChart3, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[var(--teal)]/10 text-[var(--teal-dark)] text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-[var(--teal)] rounded-full animate-pulse"></span>
                99.9% verified accuracy
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--navy)] leading-tight">
                The AI detector that{' '}
                <span className="text-[var(--accent)]">actually works</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Detect ChatGPT, Claude, Gemini and more with unmatched accuracy.
                Verified by University of Maryland. Near-zero false positive rate.
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced AI Detection
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Third-party Verified
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Trial
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg shadow-orange-500/20">
                  Try for Free →
                </Link>
                <Link href="/#features" className="btn-secondary text-lg px-8 py-4 rounded-xl">
                  How it Works
                </Link>
              </div>
            </div>

            {/* Right Column - Demo */}
            <div className="lg:pl-8">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">
            Trusted by Leading Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-gray-400">
            <span className="text-sm font-medium">University of Maryland</span>
            <span className="text-sm font-medium">Chicago Booth</span>
            <span className="text-sm font-medium">Stony Brook University</span>
            <span className="text-sm font-medium">SOC2 Type 2</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)]">
              Advanced Detection Technology
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              99.9% accuracy where others fail.
              Developed by researchers from Stanford, Tesla and Google.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI Probability Score"
              description="Submit your content and get a precise score indicating whether the text is human-written or AI-generated."
            />
            <FeatureCard
              icon={<FileSearch className="w-8 h-8" />}
              title="Model Identification"
              description="Detect which model was used: ChatGPT, Claude, Gemini, Llama, Perplexity and many more."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Section Analysis"
              description="Understand if the entire text is AI, human, or a combination of both, section by section."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Plagiarism Detection"
              description="Search across billions of web pages, books and articles to detect plagiarism alongside AI."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Near-zero False Positives"
              description="Independently verified for the lowest false positive rate on the market. 100% reliable."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Multilingual"
              description="Accurate detection in multiple languages, including English, French, Spanish and German."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-[var(--bg-light)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)]">
              Simple as 1, 2, 3
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number="1"
              title="Paste your text"
              description="Copy and paste the content to analyse into our intuitive interface."
            />
            <StepCard
              number="2"
              title="Run the analysis"
              description="Our AI engine analyses every sentence in seconds."
            />
            <StepCard
              number="3"
              title="View the report"
              description="Get a detailed score with model identification and section-by-section analysis."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)]">
              What Experts Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              quote="Among automatic detectors, this system significantly outperforms all others."
              author="Jenna Russell"
              role="University of Maryland"
            />
            <TestimonialCard
              quote="An almost supernaturally good detector. I haven't seen any false positives or negatives yet."
              author="Ryan Nicolace"
              role="Cloud Architect"
            />
            <TestimonialCard
              quote="My students are so convinced of its accuracy that it has become the best deterrent."
              author="Jarred Phillips"
              role="New Roads School"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-[var(--bg-light)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--navy)]">
              Transparent & Competitive Pricing
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Pangram Labs technology. UK-based support. Start free, scale as you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
            <PricingCard
              name="Free Trial"
              price="£0"
              description="Discover the precision"
              features={[
                '50 analyses per month',
                '99.9% accurate AI score',
                'Model identification',
                '7-day history',
              ]}
              cta="Get Started"
              href="/signup"
            />
            <PricingCard
              name="Professional"
              price="£21"
              period="month"
              description="For teachers and consultants"
              features={[
                '1,000 analyses per month',
                'API access (500 calls)',
                'PDF/CSV export',
                'Email support',
                '30-day history',
              ]}
              cta="Choose Pro"
              href="/signup?plan=pro"
              popular
            />
            <PricingCard
              name="University"
              price="£129"
              period="month"
              description="For educational institutions"
              features={[
                '10,000 analyses per month',
                'Unlimited API',
                'LMS integration (Canvas, Moodle, Blackboard, Brightspace, Google Classroom)',
                'Admin dashboard',
                'Priority support',
              ]}
              cta="Contact Us"
              href="mailto:hello@novalearn.co.uk"
            />
            <PricingCard
              name="Enterprise"
              price="£429"
              period="month"
              description="For national organisations"
              features={[
                'Unlimited analyses',
                'Full LMS integration (all platforms)',
                'White-label API',
                'Dedicated account manager',
                '99.9% SLA',
              ]}
              cta="Contact Us"
              href="mailto:hello@novalearn.co.uk"
            />
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Pangram Technology • 99.9% Accuracy • GDPR Compliant • UK Support
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero-alt py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to detect AI content?
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Join education professionals who trust NovaLearn
            to protect the integrity of their content.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-8 py-4 mt-8 inline-block">
            Create Free Account →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-light)] hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-light)]">
      <p className="text-gray-600 italic mb-4">&ldquo;{quote}&rdquo;</p>
      <p className="font-semibold text-[var(--navy)]">{author}</p>
      <p className="text-sm text-gray-400">{role}</p>
    </div>
  )
}
