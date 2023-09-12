import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Hero } from './components/Hero/Hero';
import { MadeFor } from './components/MadeFor/MadeFor';
import { KeyFeatures } from './components/KeyFeatures/KeyFeatures';
import { Banner } from './components/Banner/Banner';
import { PlaygroundSection } from './components/Playground/Playground';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MadeFor />
        <KeyFeatures />
        <PlaygroundSection />
        <Banner />
      </main>
      <Footer />
    </>
  );
}