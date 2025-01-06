"use client";

import { create } from 'zustand';
import { SelectMusic } from '@/lib/db/schema';

interface MusicStore {
  currentSong?: SelectMusic;
  isPlaying: boolean;
  setCurrentSong: (song?: SelectMusic) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  currentSong: undefined,
  isPlaying: false,
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
