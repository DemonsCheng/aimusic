
'use client';

import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistItem } from "./_components/playlist-item";
import { SelectMusic } from "@/lib/db/schema";
import { Icons } from "@/components/icons";
import { MusicPlayer } from "@/components/music-player";

export default function Playlist() {
  const [songs, setSongs] = useState<SelectMusic[]>([]);
  const [currentSong, setCurrentSong] = useState<SelectMusic | undefined>();

  React.useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch("https://localhost:3000/api/music", {
        method: "GET",
      });
      const { data } = await response.json();
      setSongs(data || []);
    };
    fetchSongs();
  }, []);

  const handleSongClick = (song: SelectMusic) => {
    setCurrentSong(song);
  };

  const handleClosePlayer = () => {
    setCurrentSong(undefined);
  };

  return (
    <>
      <div className="h-screen w-full bg-white p-6 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">PlayList</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Icons.heart className="w-6 h-6 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Icons.dotsHorizontal className="w-6 h-6 text-gray-500" />
              </button>
            </div>
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
                    isPlaying={currentSong?.id === song.id}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <MusicPlayer 
        currentSong={currentSong} 
        onClose={handleClosePlayer}
      />
    </>
  );
}
