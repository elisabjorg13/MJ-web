/**
 * ResponsiveSketchGrid - List layout for works (from Prismic WorkItem)
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client'; // <-- for safe image check

export default function ResponsiveSketchGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [works, setWorks] = useState<Content.WorkitemDocument[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const client = createClient();

      // side image (optional)


      // work items
      const docs = await client.getAllByType<Content.WorkitemDocument>('workitem', {
        orderings: [{ field: 'my.workitem.workitemyear', direction: 'desc' }],
      });
      setWorks(docs);
    };
    fetchAll();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (works.length === 0) {
    return <div className="w-full px-2 md:px-[18px] lg:px-5">Loading…</div>;
  }

  return (
    <div className="w-full px-2 md:px-[18px] lg:px-5">
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
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 ${
                    isExpanded ? 'bg-white !text-[#2E2E2E]' : 'bg-black !text-white'
                  } border-b border-white/20 h-14 hover:bg-white hover:!text-[#2E2E2E] transition-colors cursor-pointer`}
                >
                  {/* Mobile */}
                  <div className="md:hidden border border-red-500 flex">
                    <p className={`flex-1 flex items-center border-r border-red-500 ${isExpanded ? 'font-synt text-[24px]' : ''}`}>
                      {d.workitemtitle}
                    </p>
                    <p className="flex-1 flex items-center ">{d.workitemyear}</p>
                  </div>

                  {/* Tablet (2 cols) */}
                  <p className={`hidden md:flex lg:hidden border border-red-500 items-center justify-center text-center ${isExpanded ? 'font-synt text-[24px]' : ''}`}>
                    {d.workitemtitle}
                  </p>
                  <div className="hidden md:flex lg:hidden border border-red-500">
                    <p className="flex-1 flex items-center border-r border-red-500">{d.workitemstatus}</p>
                    <p className="flex-1 flex items-center border-r border-red-500">{d.workitemartist}</p>
                    <p className="flex-1 flex items-center text-right justify-end p-2">{d.workitemyear}</p>
                  </div>

                  {/* Desktop (3 cols) */}
                  <p className={`hidden lg:flex border border-red-500 items-center justify-center text-center ${isExpanded ? 'font-synt text-[24px]' : ''}`}>
                    {d.workitemtitle}
                  </p>
                  <div className="hidden lg:flex border border-red-500 flex-row">
                    <p className="flex-1 flex items-center text-left border-r border-red-500/50">{d.workitemstatus}</p>
                    <p className="flex-1 flex items-center text-center">{d.workitemartist}</p>
                  </div>
                  <p className="hidden lg:flex border border-red-500 items-center text-right justify-end p-2">{d.workitemyear}</p>
                </div>

                {/* Expanded content */}
                <div
                  className={`bg-white text-black border-b border-gray-200 overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'h-[494px]' : 'h-0 p-0'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Text content */}
                    <div className="border border-red-500 text-[#2E2E2E] font-synt">
                      <p className="text-[24px]">{d.workitemdescription}</p>
                    </div>

                    {/* Image (per-work item) with fallback */}
                    <div className="border border-red-500 flex items-center justify-center ">
                      {isFilled.image(d.workitemimage) ? (
                        <PrismicNextImage
                          field={d.workitemimage}
                          className="w-full h-auto"
                          // optional: sizes for responsive perf
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="w-full h-full min-h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500">
                          Add image
                        </div>
                      )}
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
