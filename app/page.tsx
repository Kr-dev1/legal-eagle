"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  Gavel,
  MessagesSquare,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Clock,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { easeOut } from "framer-motion";

// Client Component for Animated Elements
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0.2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedFeatureCard: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

// Main Page Component (Server Component)
export default function LegalHawkLandingPage() {
  const features = [
    {
      icon: <UploadCloud className="h-8 w-8 text-violet-400" />,
      title: "Secure PDF Upload",
      description:
        "Effortlessly upload your PDF contracts. Our system ensures your documents are handled securely and privately from the moment they arrive.",
    },
    {
      icon: <FileText className="h-8 w-8 text-violet-400" />,
      title: "AI-Powered Analysis",
      description:
        "Instantly receive a clear summary, identify key parties, and determine the document type. Our AI cuts through the jargon so you don't have to.",
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-violet-400" />,
      title: "Interactive Contract Chat",
      description:
        "Ask questions about your contract in plain English. Get specific, context-aware answers about clauses, obligations, and complex terms.",
    },
    {
      icon: <Gavel className="h-8 w-8 text-violet-400" />,
      title: "Contextual Legal Insights",
      description:
        "Our AI considers relevant laws from specified jurisdictions, providing smarter, more accurate analysis of your contract's terms.",
    },
  ];

  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-emerald-400" />,
      title: "Save Precious Time",
      description:
        "Stop spending hours deciphering dense legal documents. Get the critical information you need in a fraction of the time.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-400" />,
      title: "Gain Unmatched Clarity",
      description:
        "Eliminate confusion and confidently understand your rights and obligations. Make informed decisions with a clear view of every detail.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-sky-400" />,
      title: "Reduce Potential Risks",
      description:
        "Proactively identify ambiguous clauses and potential risks before they can become costly problems. Stay one step ahead.",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-zinc-700/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] -z-10"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-white/[0.1]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="150 -200 1000 1250"
              className="h-7 w-7"
            >
              <path
                d="M851.3,118c-41-75.7-140.9-78.2-210.9-75.6c-106.9,4.2-182.9,83.3-189,248.6c-1.7,45.9-35.2,181.2-76.2,292.7l171.2,139.9  l33.4-39.8l67,66.4l76.7-66.7l25.4,40.1l170.7-139.4l0.7-0.4c-41-111.5-67.9-247.5-76.1-292.6c27.4-39.4,100.1-68.3,157-11.6  C1039.3,161,982.3,123.4,851.3,118z M728.9,120.3c12.6,9.4,26.7,16.9,42.4,22.1c8.8,2.9,17.8,5.1,27,6.7  c-3.6,17.6-18.9,30.8-37.3,30.8c-21,0-38.1-17.3-38.1-38.7C722.8,133.5,725.1,126.3,728.9,120.3z"
                fill="white"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight">Legal Hawk</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          </nav>
          <Link
            href="/signup"
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-primary px-5 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-20 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 pb-2">
              Your Personal AI Contract Analyst
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Stop guessing. Securely upload your legal documents, ask questions in plain English, and get instant, intelligent answers.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <span>Analyze Your First Contract</span>
                <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-card/20">
          <div className="container mx-auto px-6">
            <AnimatedSection className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Transform How You Handle Contracts
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Legal Hawk provides a powerful suite of tools to demystify complex legal language.
              </p>
            </AnimatedSection>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <AnimatedFeatureCard key={feature.title} delay={index * 0.1}>
                  <div className="bg-card/50 border border-white/[0.1] rounded-lg p-6 h-full flex flex-col items-start transition-all duration-300 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10">
                    <div className="bg-violet-500/10 p-3 rounded-md mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedFeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20">
          <div className="container mx-auto px-6">
            <AnimatedSection className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Clarity, Confidence, and Control
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Empower yourself with the insights you need to navigate any contract.
              </p>
            </AnimatedSection>

            <div className="mt-16 max-w-4xl mx-auto grid gap-10 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={benefit.title} delay={index * 0.15}>
                  <div className="flex flex-col items-center text-center">
                    {benefit.icon}
                    <h3 className="text-xl font-semibold mt-5 mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-24">
          <AnimatedSection>
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to Demystify Your Legal Documents?
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Sign up today and experience a smarter way to manage your contracts.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-primary px-8 font-semibold text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <span>Get Started for Free</span>
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.1]">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Legal Hawk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}