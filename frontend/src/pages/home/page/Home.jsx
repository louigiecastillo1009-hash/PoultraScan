import { PageStyles } from '../css/PageStyles.jsx';
import {
  NavBar,
  Hero,
  ProductIntro,
  HowItWorks,
  FeatureGrid,
  ProductPreview,
  ResponsibleUse,
  CtaBanner,
  Footer,
} from '../components/index';

export default function HomePage() {
  return (
    <div className="ps-home min-h-dvh overflow-x-clip">
      <PageStyles />
      <NavBar />
      <main>
        <Hero />
        <ProductIntro />
        <HowItWorks />
        <FeatureGrid />
        <ProductPreview />
        <ResponsibleUse />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
