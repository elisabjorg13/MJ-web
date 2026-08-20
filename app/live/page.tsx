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

function getArtistNames(
  artists: Content.TicketTourDocument["data"]["artists"] | unknown
) {
  if (!Array.isArray(artists)) return [];
  return artists
    .map((artist) => artist.name?.trim())
    .filter((name): name is string => Boolean(name));
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
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white pt-[150px] md:pt-[86px] pb-16">
      <div className="w-full flex flex-col items-center gap-3 px-2 md:px-4">
        {tours.map((tour) => {
          const { tour_name, artists, tickets } = tour.data;
          const artistNames = getArtistNames(artists);
          const [firstArtist, ...otherArtists] = artistNames;

          return (
            <article
              key={tour.id}
              className="w-full md:max-w-[420px] bg-[#B1B1B1] rounded-[5px] px-2 pt-1 pb-3 text-[#2E2E2E]"
            >
              <div className="flex flex-col items-center text-center gap-0 mb-8">
                {tour_name && (
                  <h2 className="font-synt text-[48px] leading-none">
                    {tour_name}
                  </h2>
                )}
                {firstArtist && (
                  <div className="font-synt text-[24px] leading-[1.2] mt-0.5">
                    <p className="font-synt text-[24px] leading-[1.2]">
                      {firstArtist}
                    </p>
                    {otherArtists.length > 0 && (
                      <p className="font-synt text-[24px] leading-[1.2]">
                        {`& ${otherArtists.join(", ")}`}
                      </p>
                    )}
                  </div>
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
