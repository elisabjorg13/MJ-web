'use client';

import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { useState, useEffect } from 'react';
import type { Content } from '@prismicio/client';

export default function Home() {
  const [landingPages, setLandingPages] = useState<Content.LandingpageimageDocument[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Disable body scrolling on landing page
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + landingPages.length) % landingPages.length);
  };

  if (landingPages.length === 0) return <div className="bg-white h-screen" />;

  const currentPage = landingPages[currentIndex];
  const hasCarousel = landingPages.length > 1;

  return (
    <div className="bg-white h-[100dvh] pt-[150px] md:pt-[70px] overflow-hidden relative">
      {hasCarousel && (
        <>
          <div
            className="hidden md:block fixed left-0 top-0 w-1/2 h-full z-10"
            style={{ cursor: "url('/icons/Arrow-left.svg') 32 26, auto" }}
            onClick={handlePrev}
          />
          <div
            className="hidden md:block fixed right-0 top-0 w-1/2 h-full z-10"
            style={{ cursor: "url('/icons/Arrow-right.svg') 32 26, auto" }}
            onClick={handleNext}
          />
          <div className="md:hidden fixed inset-0 z-10" onClick={handleNext} />
        </>
      )}
      <div className="h-full flex items-end relative pb-safe">
        {currentPage?.data.image && (
          <PrismicNextImage
            field={currentPage.data.image}
            className="h-full w-auto object-contain object-bottom"
          />
        )}
        
      </div>
    </div>
  )
}

