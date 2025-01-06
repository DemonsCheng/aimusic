'use client';

import { useEffect, useRef, useState } from "react";
import { Icons } from "./icons";
import { Avatar } from "./ui/avatar";
import { PlayerSlider } from "./ui/player-slider";
import { SelectMusic } from "@/lib/db/schema";

interface MusicPlayerProps {
  currentSong?: SelectMusic;
  onClose: () => void;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
}

export function MusicPlayer({ currentSong, onClose, isPlaying, onPlayPause }: MusicPlayerProps) {
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentSong?.audio_url) {
      setIsLoading(true);
      if (audioRef.current) {
        audioRef.current.src = currentSong.audio_url;
        audioRef.current.load();
        
        const handleCanPlay = () => {
          setIsLoading(false);
          if (isPlaying) {
            const playPromise = audioRef.current?.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Playback was interrupted:", error);
                onPlayPause(false);
              });
            }
          }
        };

        audioRef.current.addEventListener('canplay', handleCanPlay);
        
        return () => {
          audioRef.current?.removeEventListener('canplay', handleCanPlay);
          audioRef.current?.pause();
          if (audioRef.current) {
            audioRef.current.src = "";
          }
        };
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Playback was interrupted:", error);
            onPlayPause(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    onPlayPause(!isPlaying);
  };

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onPlayPause(false)}
        preload="auto"
      />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[60%] bg-white border-t h-20 z-[100] shadow-lg rounded-t-lg">
        <div className="h-full flex items-center justify-between relative px-6">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <Icons.spinner className="w-6 h-6 animate-spin" />
            </div>
          )}
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
          >
            <Icons.close className="w-4 h-4 text-gray-500" />
          </button>

          {/* Song Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <img
                src={currentSong.image_url || "/default-album.png"}
                alt={currentSong.title}
                className="object-cover"
              />
            </Avatar>
            <div>
              <h4 className="text-sm font-medium">{currentSong.title}</h4>
              <p className="text-xs text-gray-500">{currentSong.style}</p>
            </div>
            <button className="ml-4">
              <Icons.heart className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center flex-1 max-w-2xl px-8">
            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-gray-600">
                <Icons.skipBack className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isPlaying ? (
                  <Icons.pause className="w-6 h-6" />
                ) : (
                  <Icons.play className="w-6 h-6" />
                )}
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Icons.skipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">
                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
              </span>
              <PlayerSlider
                value={[progress]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={handleProgressChange}
              />
              <span className="text-xs text-gray-500">
                {audioRef.current ? formatTime(audioRef.current.duration || 0) : '0:00'}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 mr-9">
            <Icons.volume2 className="w-5 h-5 text-gray-400" />
            <PlayerSlider
              value={[volume]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
