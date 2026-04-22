import dynamic from "next/dynamic";

import Hero from "@/components/sections/Hero";
import CTASection from "@/components/sections/CTA";

const Stats = dynamic(() => import("@/components/sections/Stats"), {
  loading: () => <div className="h-32" />,
});
const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => <div className="h-32" />,
});
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"), {
  loading: () => <div className="h-32" />,
});
const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials"),
  { loading: () => <div className="h-32" /> },
);
const FAQ = dynamic(() => import("@/components/sections/FAQ"), {
  loading: () => <div className="h-32" />,
});

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
