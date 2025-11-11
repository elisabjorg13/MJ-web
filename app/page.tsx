'use client';

import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { useState, useEffect } from 'react';
import type { Content } from '@prismicio/client';

export default function Home() {
  const [landingPages, setLandingPages] = useState<Content.LandingpageimageDocument[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const client = createClient();
      const pages = await client.getAllByType('landingpageimage');
      const filtered = pages.filter(p => p.data.image);
      // Sort by title (img1, img2, img3, etc.)
      const sorted = filtered.sort((a, b) => {
        const titleA = a.data.title || '';
        const titleB = b.data.title || '';
        return titleA.localeCompare(titleB, undefined, { numeric: true });
      });
      setLandingPages(sorted);
    };
    fetchImages();
  }, []);

  // Auto-advance after 5 seconds
  useEffect(() => {
    if (landingPages.length === 0) return;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % landingPages.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, landingPages.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % landingPages.length);
  };

  const handlePageClick = () => {
    handleNext();
  };

  if (landingPages.length === 0) return <div className="bg-white h-screen pt-[70px]">Loading...</div>;

  const currentPage = landingPages[currentIndex];

  return (
    <div className="bg-white h-screen pt-[150px] md:pt-[70px]" onClick={handlePageClick}>
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
        > </button>
      </div>
    </div>
  )
}

