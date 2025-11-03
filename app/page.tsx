'use client';

import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { useState, useEffect } from 'react';

export default function Home() {
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const client = createClient();
      const pages = await client.getAllByType('landingpageimage');
      setLandingPages(pages.filter(p => p.data.image));
    };
    fetchImages();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % landingPages.length);
  };

  if (landingPages.length === 0) return <div className="bg-white h-screen pt-[70px]">Loading...</div>;

  const currentPage = landingPages[currentIndex];

  return (
    <div className="bg-white h-screen pt-[70px]">
      <div className="h-full flex items-end relative">
        {currentPage?.data.image && (
          <PrismicNextImage
            field={currentPage.data.image}
            className="h-full w-auto object-contain object-bottom"
          />
        )}
        
        {/* Dev Next Button */}
        <button
          onClick={handleNext}
          className="fixed bottom-4 right-4 text-black px-4 py-2 rounded hover:bg-gray-800"
        >
          Next ({currentIndex + 1}/{landingPages.length})
        </button>
      </div>
    </div>
  )
}

