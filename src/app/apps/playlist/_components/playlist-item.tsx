'use client';

import React from 'react';
import { Avatar } from "@/components/ui/avatar";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
}

interface PlaylistItemProps {
  song: Song;
}

export function PlaylistItem({ song }: PlaylistItemProps) {
  return (
    <button
      key={song.id}
      className="flex items-center space-x-4 p-2 hover:bg-white/10 rounded-lg transition-colors w-full"
      onClick={() => console.log(`Play song ${song.title}`)}
    >
      <Avatar className="h-10 w-10 rounded-md">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="object-cover"
        />
      </Avatar>
      <div className="flex-1 space-y-1 text-left">
        <p className="text-sm font-medium leading-none">{song.title}</p>
        <p className="text-sm text-muted-foreground">{song.artist}</p>
      </div>
      <div className="text-sm text-muted-foreground">{song.duration}</div>
    </button>
  );
}
