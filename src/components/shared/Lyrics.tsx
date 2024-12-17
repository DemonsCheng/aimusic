'use client';

import React from 'react';

interface LyricsProps {
  title: string;
  genre: string;
  author: string;
  date: string;
  verses: string;
}

export function Lyrics({ title, genre, author, date, verses }: LyricsProps) {
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
            {content.split('\n').map((line, lineIndex) => (
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
    <div className="w-full max-w-2xl  backdrop-blur p-6 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-12rem)]">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="text-muted-foreground text-sm">
          <span>{genre}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">{author}</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="space-y-6">
        {renderVerses(verses)}
      </div>
    </div>
  );
}
