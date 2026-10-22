import { PageStyles } from '../css/PageStyles.jsx';
import {
  NavBar,
  Hero,
  StatsStrip,
  HowItWorks,
  FeatureGrid,
  Testimonial,
  CtaBanner,
  Footer,
} from '../components/index';

export default function HomePage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#ECEDF1] text-[#0B0B0D] antialiased">
      <PageStyles />
      <NavBar />
      <main>
        <Hero />
        <StatsStrip />
        <HowItWorks />
        <FeatureGrid />
        <Testimonial />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
