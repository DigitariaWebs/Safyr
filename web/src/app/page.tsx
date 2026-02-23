import dynamic from "next/dynamic";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";

const Stats = dynamic(() => import("@/components/sections/Stats"), {
  loading: () => <div className="h-32" />,
});
const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => <div className="h-32" />,
});
const Services = dynamic(() => import("@/components/sections/Services"), {
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
const Contact = dynamic(() => import("@/components/sections/Contact"), {
  loading: () => <div className="h-32" />,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
