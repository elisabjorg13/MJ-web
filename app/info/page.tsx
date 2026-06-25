"use client";

import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";
import { useState, useEffect } from "react";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import Image from "next/image";
import mjLogo from "@/public/images/MJ-logo 1.png";

export default function Info() {
  const [infoContent, setInfoContent] =
    useState<Content.InfoContentDocument | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const client = createClient();
      const info = await client.getSingle("info_content");
      setInfoContent(info);
    };
    fetchInfo();
  }, []);

  if (!infoContent) {
    return (
      <div className="min-h-screen bg-white pt-[150px] md:pt-[86px]">
        <div className="w-full px-2 md:px-[18px] lg:px-5">Loading…</div>
      </div>
    );
  }

  const data = infoContent.data;

  return (
    <div className="min-h-screen bg-white pt-[150px] md:pt-0">
          {/* Column 1 - fixed on desktop */}
          <div className="hidden md:flex flex-col gap-2 font-synt [&_p]:!text-[24px] [&_*]:!text-[24px] [&_*]:!text-[#2E2E2E] [&_a]:!text-[#2E2E2E] [&_p]:![line-height:1.2] [&_*]:![line-height:1.2] fixed top-[86px] left-0 w-1/2 px-4">
            <div className="flex flex-col gap-0">
              <a
                href="https://www.instagram.com/magnus__johann/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline hover:!text-[#b1b1b1] transition-colors"
              >Instagram</a>

              <a href="mailto:magnusjragnarsson@gmail.com" className="inline hover:!text-[#b1b1b1] transition-colors">magnusjragnarsson@gmail.com</a>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex">
              <Image
                src={mjLogo}
                alt="MJ logo"
                width={272}
                height={197}
                className=""
              />
              </div>
            </div>
          </div>

          {/* Column 1 - mobile only */}
          <div className="md:hidden flex flex-col gap-2 font-synt [&_p]:!text-[24px] [&_*]:!text-[24px] [&_*]:!text-[#2E2E2E] [&_a]:!text-[#2E2E2E] [&_p]:![line-height:1.2] [&_*]:![line-height:1.2] px-4">
            <div className="flex flex-col gap-0">
              <a
                href="https://www.instagram.com/magnus__johann/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline hover:!text-[#b1b1b1] transition-colors"
              >Instagram</a>

              <a href="mailto:magnusjragnarsson@gmail.com" className="inline hover:!text-[#b1b1b1] transition-colors">magnusjragnarsson@gmail.com</a>
            </div>
            <div className="flex justify-center">
              <Image
                src={mjLogo}
                alt="MJ logo"
                width={272}
                height={197}
                className=""
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="md:ml-[50%] md:pt-[86px] px-4 selection:bg-[#b1b1b1] selection:text-[#2E2E2E]">
            {isFilled.richText(data.info_textcontent) && (
              <div className="font-synt [&_p]:!text-[24px] [&_*]:!text-[24px] [&_*]:!text-[#2E2E2E] [&_a]:!text-[#2E2E2E] [&_p]:![line-height:1.2] [&_*]:![line-height:1.2]">
                <PrismicRichText field={data.info_textcontent} />
              </div>
            )}
          </div>
    </div>
  );
}
