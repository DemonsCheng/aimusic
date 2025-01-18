"use client";

import React from "react";

interface LyricsProps {
  title: string;
  genre: string;
  author: string;
  date: string;
  verses: string;
  isPlaying?: boolean;
  coverImage?: string;
}

export function Lyrics({
  title,
  genre,
  author,
  date,
  verses,
  isPlaying = false,
  coverImage,
}: LyricsProps) {
  const renderVerses = (verses: string) => {
    const sections = verses.split(/\[(.*?)\]/g).filter(Boolean);
    const result = [];

    for (let i = 0; i < sections.length; i += 2) {
      if (i + 1 < sections.length) {
        const type = sections[i].trim();
        const content = sections[i + 1].trim();
        result.push(
          <div key={i} className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              [{type}]
            </div>
            {content.split("\n").map((line, lineIndex) => (
              <div key={lineIndex} className="text-foreground">
                {line.trim()}
              </div>
            ))}
          </div>
        );
      }
    }

    return result;
  };

  return (
    <div className="w-full max-w-2xl   p-1  shadow-lg  max-h-[calc(100vh-2rem)]">
      {/* Vinyl Record Player */}
      <div className="relative w-full aspect-square max-w-[300px] p-3 mx-auto mb-6">
        {/* Tonearm */}
        <div
          className={`absolute -right-4 -top-4 w-40 h-40 transition-transform duration-1000 ${
            isPlaying ? "rotate-[20deg]" : "rotate-[-10deg]"
          }`}
          style={{
            transformOrigin: "top right",
            filter: "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
          }}
        >
          {/* Tonearm base */}
          {/* <div className="absolute top-0 right-0 w-5 h-5 bg-white rounded-full opacity-90" /> */}

          {/* Main arm - using pseudo elements for the curved design */}
          {/* <div 
            className="absolute top-[10px] right-[10px] w-[4px] h-32 bg-white rounded-full before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:rounded-full before:transform before:rotate-[2deg] before:origin-top"
            style={{
              transformOrigin: 'top center',
              transform: 'rotate(-8deg)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.85))'
            }}
          /> */}

          {/* Cartridge with more detail */}
          {/* <div className="absolute bottom-6 right-[2px] flex items-center">
            <div 
              className="w-10 h-3 bg-white rounded-sm"
              style={{
                transform: 'rotate(-8deg)',
                background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.95))'
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white/60" />
            </div>
          </div> */}
        </div>

        {/* Record */}
        <div
          className={`relative w-full aspect-square rounded-full bg-[#333] ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{
            animationDuration: "10s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          }}
        >
          {/* Record grooves */}
          <div className="absolute inset-[15%] rounded-full border-[1px] border-gray-600 opacity-50" />
          <div className="absolute inset-[25%] rounded-full border-[1px] border-gray-600 opacity-50" />
          <div className="absolute inset-[35%] rounded-full border-[1px] border-gray-600 opacity-50" />

          {/* Inner circle with cover art */}
          <div className="absolute inset-[20%] rounded-full overflow-hidden ring-4 ring-black">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Album cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700" />
            )}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl text-center font-bold  mx-auto mb-2">
          {title}
        </h2>
        <div className="text-muted-foreground text-sm text-center">
          <span>{genre}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 ">
          <span className="text-sm mx-auto text-center text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="space-y-6">{renderVerses(verses)}</div>
    </div>
  );
}
