'use client';

import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { SelectMusic } from '@/lib/db/schema';
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PlaylistItemProps {
  song: SelectMusic;
  index: number;
  onClick?: () => void;
  isPlaying?: boolean;
}

export function PlaylistItem({ song, index, onClick, isPlaying }: PlaylistItemProps) {
  return (
    <button
      key={song.id}
      className={cn(
        "flex items-center w-full px-4 py-2 hover:bg-gray-50 group",
        isPlaying && "bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="w-8 relative">
        <span className={cn(
          "text-sm text-gray-400 group-hover:hidden",
          isPlaying && "hidden"
        )}>{index}</span>
        <Icons.play className={cn(
          "w-4 h-4 text-gray-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block",
          isPlaying && "block"
        )} />
      </div>
      <Avatar className="h-10 w-10 rounded">
        <img
          src={song.image_url || "/default-album.png"}
          alt={song.title}
          className="object-cover"
        />
      </Avatar>
      <div className="flex-1 ml-4 text-left">
        <p className={cn(
          "text-sm font-medium text-gray-900",
          isPlaying && "text-blue-600"
        )}>{song.title}</p>
        <p className="text-sm text-gray-500">{song.style}</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* <Icons.download className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
        <span className="text-sm font-mono text-gray-500">
          {song.duration ? `${String(Math.floor(song.duration / 60)).padStart(2, '0')}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : 'N/A'}
        </span>
        <Icons.dotsHorizontal className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
