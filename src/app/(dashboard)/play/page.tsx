'use client';

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistItem } from "./_components/playlist-item";
import { SelectMusic } from "@/lib/db/schema";
import { Icons } from "@/components/icons";
import { useMusicStore } from "@/store/music-store";

interface PlaylistProps {
  songs: SelectMusic[];
}

export default function Playlist({ songs }: PlaylistProps) {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useMusicStore();

  const handleSongClick = (song: SelectMusic) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className="h-screen w-full p-1 pb-28">
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">PlayList</h2>
          </div>
          
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-1">
              {songs === undefined ? (
                <p>Failed to fetch data</p>
              ) : (
                songs.map((song: SelectMusic, index: number) => (
                  <PlaylistItem 
                    key={song.id} 
                    song={song} 
                    index={index + 1}
                    onClick={() => handleSongClick(song)}
                    isPlaying={currentSong?.id === song.id && isPlaying}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
