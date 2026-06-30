/**
 * ResponsiveSketchGrid - List layout for works (from Prismic WorkItem)
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/prismicio";
import { PrismicNextImage } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client"; // <-- for safe image check

export default function ResponsiveSketchGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [works, setWorks] = useState<Content.WorkitemDocument[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchAll = async () => {
      const client = createClient();

      const docs = await client.getAllByType<Content.WorkitemDocument>(
        "workitem",
        {
          orderings: [{ field: "my.workitem.workitemyear", direction: "desc" }],
        }
      );
      setWorks(docs);
    };
    fetchAll();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Reset image index when expanding
    if (expandedId !== id) {
      setCurrentImageIndex((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  // Get available images for a work item
  const getImages = (d: Content.WorkitemDocument["data"]) => {
    const images = [];
    // Access new fields that aren't in the generated types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = d as Content.WorkitemDocument["data"] & Record<string, any>;
    if (isFilled.image(data.workitemimage1)) images.push(data.workitemimage1);
    if (isFilled.image(data.workitemimage2)) images.push(data.workitemimage2);
    if (isFilled.image(data.workitemimage3)) images.push(data.workitemimage3);
    return images;
  };


  if (works.length === 0) {
    return <div className="w-full px-2 md:px-[18px] lg:px-5">Loading…</div>;
  }

  return (
    <div className="w-full mt-1 px-2 md:px-[18px] lg:px-5">
      <div className="mx-auto">
        <div className="flex flex-col">
          {works.map((work) => {
            const isExpanded = expandedId === work.id;
            const d = work.data;
            return (
              <div key={work.id}>
                {/* List item row */}
                <div
                  onClick={() => toggleExpand(work.id)}
                  className={`
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-0.5
                    ${isExpanded ? "bg-white !text-[#2E2E2E]" : "bg-[#0D0D0D] !text-[#b1b1b1]"}
                    border-b border-white/20 h-14
                    hover:bg-white hover:!text-[#2E2E2E]
                    transition-colors cursor-pointer
                  `}
                >
                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-center p-2">
                    <div className="flex flex-col flex-1">
                      <p
                        className={`text-center ${isExpanded ? "font-synt text-[24px]" : ""}`}
                      >
                        {d.workitemtitle}
                      </p>
                      <div className="flex flex-row justify-between">
                        <p>{d.workitemstatus}</p>
                        <p>{d.workitemyear}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tablet (2 cols) */}
                  <p
                    className={`hidden md:flex lg:hidden items-center justify-center text-center ${
                      isExpanded ? "font-synt text-[24px]" : ""
                    }`}
                  >
                    {d.workitemtitle}
                  </p>
                  <div className="hidden md:flex lg:hidden">
                    <p className="flex-1 flex items-center">
                      {d.workitemstatus}
                    </p>
                    <p className="flex-1 flex items-center ">
                      {d.workitemartist}
                    </p>
                    <p className="flex-1 flex items-center justify-end p-2">
                      {d.workitemyear}
                    </p>
                  </div>

                  {/* Desktop (6-col grid) */}
                  {/* title spans col 1–2 */}
                  <p
                    className={`hidden lg:flex col-span-2 items-center justify-center text-center ${
                      isExpanded ? "font-synt text-[24px]" : ""
                    }`}
                  >
                    {d.workitemtitle}
                  </p>

                  {/* status in col 3 */}
                  <p className="hidden lg:flex col-span-1  items-center">
                    {d.workitemstatus}
                  </p>

                  {/* artist spans col 4–5 (room for long names) */}
                  <p className="hidden lg:flex col-span-2  items-center">
                    {d.workitemartist}
                  </p>

                  {/* year in col 6 */}
                  <p className="hidden lg:flex col-span-1  items-center justify-end p-2">
                    {d.workitemyear}
                  </p>
                </div>

                {/* Expanded content */}
                <div
                  className={`bg-white text-black border-b border-gray-200 overflow-hidden transition-[height] duration-500 ${
                    isExpanded ? "h-auto md:h-[494px]" : "h-0 p-0"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full ">
                    {/* Text content */}
                    <div className="relative pr-2">
                      <div className="md:ml-2 [&_p]:[line-height:1.2]">
                        <p className="text-[21px] md:text-[24px] font-synt">
                          {d.workitemdescription}
                        </p>
                      </div>
                    
                    </div>

                    {/* Image carousel (per-work item) */}
                    <div className="w-full flex flex-col md:block md:h-[494px]">
                    <div className="w-full h-[360px] md:h-full relative">
                      {(() => {
                        const images = getImages(d);
                        const currentIndex = currentImageIndex[work.id] || 0;
                        const currentImage = images[currentIndex];

                        if (images.length === 0) {
                          return (
                            <div className="w-full h-full min-h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500">
                              Add image
                            </div>
                          );
                        }

                        return (
                          <div className="relative w-full h-full">
                            {/* Desktop: left half - previous */}
                            {images.length > 1 && (
                              <div
                                className="hidden md:block absolute left-0 top-0 w-1/2 h-full z-10"
                                style={{ cursor: "url('/icons/Arrow-left.svg') 14 11, auto" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex((prev) => {
                                    const current = prev[work.id] || 0;
                                    return { ...prev, [work.id]: (current - 1 + images.length) % images.length };
                                  });
                                }}
                              />
                            )}
                            {/* Desktop: right half - next */}
                            {images.length > 1 && (
                              <div
                                className="hidden md:block absolute right-0 top-0 w-1/2 h-full z-10"
                                style={{ cursor: "url('/icons/Arrow-right.svg') 14 11, auto" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex((prev) => {
                                    const current = prev[work.id] || 0;
                                    return { ...prev, [work.id]: (current + 1) % images.length };
                                  });
                                }}
                              />
                            )}
                            {/* Mobile: tap anywhere to advance */}
                            {images.length > 1 && (
                              <div
                                className="md:hidden absolute inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex((prev) => {
                                    const current = prev[work.id] || 0;
                                    return { ...prev, [work.id]: (current + 1) % images.length };
                                  });
                                }}
                              />
                            )}
                            <PrismicNextImage
                              field={currentImage}
                              fill
                              style={{ objectFit: "contain", objectPosition: "left top" }}
                            />

                          </div>
                        );
                      })()}
                    </div>
                    {/* Mobile counter bar */}
                    <div className="md:hidden px-2 py-1">
                      <p className="text-[#2E2E2E]">
                        {(currentImageIndex[work.id] || 0) + 1}/{getImages(work.data).length}
                      </p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
