'use client';

import { MusicPlayer } from "./music-player";
import { useMusicStore } from "@/store/music-store";

export function MusicPlayerWrapper() {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useMusicStore();

  if (!currentSong) return null;

  return (
    <MusicPlayer
      currentSong={currentSong}
      onClose={() => setCurrentSong(undefined)}
      isPlaying={isPlaying}
      onPlayPause={setIsPlaying}
    />
  );
}
