import React, { useRef } from 'react';
import Hero from '../components/Hero/Hero';
import Timeline from '../components/Timeline/Timeline';
import PdfGenerator from '../components/PdfGenerator/PdfGenerator';

const Home: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null); // 🔹 Referencia para capturar Home

  return (
    <div ref={contentRef} id='home-content'>
      <PdfGenerator contentRef={contentRef} /> {/* 🔹 Pasamos la referencia */}
      <Hero />
      <Timeline />
    </div>
  );
};

export default Home;
