"use client";

import { createClient } from "@/prismicio";
import { useState, useEffect } from "react";
import type { Content } from "@prismicio/client";
import { asLink, isFilled } from "@prismicio/client";

function formatTourDate(date: string | null | undefined) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}.${month}.${year}`;
}

export default function Live() {
  const [tours, setTours] = useState<Content.TicketTourDocument[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      const client = createClient();
      const docs = await client.getAllByType<Content.TicketTourDocument>(
        "ticket_tour"
      );
      setTours(docs);
      setLoaded(true);
    };
    fetchTours();
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white pt-[150px] md:pt-[86px]">
        <div className="w-full px-2 md:px-[18px] lg:px-5">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[150px] md:pt-[86px] pb-16">
      <div className="w-full flex flex-col items-center gap-3 px-4">
        {tours.map((tour) => {
          const { tour_name, artists, tickets } = tour.data;

          return (
            <article
              key={tour.id}
              className="w-full max-w-[420px] bg-[#B1B1B1] rounded-[5px] px-6 pt-3 pb-3 text-[#2E2E2E]"
            >
              <div className="flex flex-col items-center text-center gap-1 mb-8">
                {tour_name && (
                  <h2 className="font-synt text-[40px] md:text-[48px] leading-[1.05]">
                    {tour_name}
                  </h2>
                )}
                {artists && (
                  <p className="font-synt text-[24px] md:text-[24px] leading-[1.2] whitespace-pre-line">
                    {artists}
                  </p>
                )}
              </div>

              {tickets.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {tickets.map((ticket, index) => {
                    const dateLabel = formatTourDate(ticket.date);
                    const location = ticket.location || "";
                    const href = isFilled.link(ticket.ticket_link)
                      ? asLink(ticket.ticket_link)
                      : null;

                    return (
                      <li
                        key={`${tour.id}-${index}`}
                        className="flex items-baseline justify-between gap-4 text-[14px]"
                      >
                        <p className="text-left text-[14px]">
                          {[dateLabel, location].filter(Boolean).join(" ")}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 hover:opacity-60 transition-opacity"
                          >
                            <p className="text-[14px]">Tickets</p>
                          </a>
                        ) : (
                          <p className="shrink-0 opacity-40 text-[14px]">Tickets</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
