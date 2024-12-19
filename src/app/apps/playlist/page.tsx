'use client';

import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistItem } from "./_components/playlist-item";
import { SelectMusic } from "@/lib/db/schema";
import { Icons } from "@/components/icons";
import { MusicPlayer } from "@/components/music-player";

interface PlaylistProps {
  onSongSelect?: (song: SelectMusic | undefined) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export default function Playlist({ onSongSelect, onPlayingChange }: PlaylistProps) {
  const [songs, setSongs] = useState<SelectMusic[]>([]);
  const [currentSong, setCurrentSong] = useState<SelectMusic | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (currentSong?.id === song.id) {
      const newIsPlaying = !isPlaying;
      setIsPlaying(newIsPlaying);
      onPlayingChange?.(newIsPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      onSongSelect?.(song);
      onPlayingChange?.(true);
    }
  };

  const handleClosePlayer = () => {
    setCurrentSong(undefined);
    setIsPlaying(false);
    onSongSelect?.(undefined);
    onPlayingChange?.(false);
  };

  return (
    <>
      <div className="h-screen w-full p-1 pb-28">
        <div className=" mx-auto">
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
      {currentSong && (
        <MusicPlayer 
          currentSong={currentSong} 
          onClose={handleClosePlayer}
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
        />
      )}
    </>
  );
}
