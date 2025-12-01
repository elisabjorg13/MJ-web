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

  // Handle image click - advance to next image
  const handleImageClick = (
    workId: string,
    totalImages: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent row toggle
    setCurrentImageIndex((prev) => {
      const current = prev[workId] || 0;
      return { ...prev, [workId]: (current + 1) % totalImages };
    });
  };

  // Handle dot click - jump to specific image
  const handleDotClick = (
    workId: string,
    index: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent row toggle
    setCurrentImageIndex((prev) => ({ ...prev, [workId]: index }));
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
                    ${isExpanded ? "bg-white !text-[#2E2E2E]" : "bg-black !text-white"}
                    border-b border-white/20 h-14
                    hover:bg-white hover:!text-[#2E2E2E]
                    transition-colors cursor-pointer
                  `}
                >
                  {/* Mobile */}
                  <div className="md:hidden border border-red-500 flex items-center justify-center p-2">
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
                    className={`hidden md:flex lg:hidden border  items-center justify-center text-center ${
                      isExpanded ? "font-synt text-[24px]" : ""
                    }`}
                  >
                    {d.workitemtitle}
                  </p>
                  <div className="hidden md:flex lg:hidden border ">
                    <p className="flex-1 flex items-center border-r">
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
                    isExpanded ? "h-[494px]" : "h-0 p-0"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full ">
                    {/* Text content */}
                    <div className="relative pr-2">
                      <div className="ml-2">
                        <p className="">{d.workitemartist}</p>
                        <p className="text-[24px] font-synt">
                          {d.workitemdescription}
                        </p>
                      </div>
                      {/* Vertical carousel dots - top right */}
                      {(() => {
                        const images = getImages(d);
                        const currentIndex = currentImageIndex[work.id] || 0;
                        return images.length > 1 ? (
                          <div className="absolute top-0 right-2 flex flex-col gap-2 z-10">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) =>
                                  handleDotClick(work.id, index, e)
                                }
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentIndex
                                    ? "bg-[#AFA7F0]"
                                    : "bg-gray-400 hover:bg-gray-600"
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Image carousel (per-work item) */}
                    <div className="w-full h-[360px] md:h-[494px] overflow-hidden flex items-start justify-start">
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
                          <div
                            className="w-full h-full flex items-start justify-start cursor-pointer"
                            onClick={(e) =>
                              handleImageClick(work.id, images.length, e)
                            }
                          >
                            <PrismicNextImage
                              field={currentImage}
                              className="transition-none"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                                objectPosition: "left top",
                              }}
                            />
                          </div>
                        );
                      })()}
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
