"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Playlist from "../play/page";
import { Lyrics } from "@/components/shared/Lyrics";
import { SelectMusic } from "@/lib/db/schema";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Component() {
  const [songs, setSongs] = useState<SelectMusic[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch("https://localhost:3000/api/music", {
        method: "GET",
      });
      const { data } = await response.json();
      setSongs(data || []);
    };
    fetchSongs();
  }, []);

  const [currentSong, setCurrentSong] = useState<SelectMusic | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4 pt-0 min-h-screen w-full">
      <div className="block lg:hidden w-full">
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <Playlist
            songs={songs}
            onSongSelect={setCurrentSong}
            onPlayingChange={setIsPlaying}
          />
        </div>
        <div className={cn(
          "bg-muted/50 rounded-xl p-2",
          !currentSong && "flex items-center justify-center"
        )}>
          {currentSong ? (
            <Lyrics
              title={currentSong.title || ""}
              genre={currentSong.style || ""}
              author={currentSong.userId || ""}
              date={currentSong.created_at || ""}
              isPlaying={isPlaying}
              coverImage={currentSong.image_url || ""}
              verses={currentSong.lyric || ""}
            />
          ) : (
            <p className="text-muted-foreground">Select a song to view lyrics</p>
          )}
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={60} maxSize={70} minSize={55}>
            <div className="h-full bg-muted/50 rounded-xl p-4">
              <Playlist
                songs={songs}
                onSongSelect={setCurrentSong}
                onPlayingChange={setIsPlaying}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30} maxSize={45}>
            <div className={cn(
              "h-full bg-muted/50 rounded-xl p-2",
              !currentSong && "flex items-center justify-center"
            )}>
              {currentSong ? (
                <Lyrics
                  title={currentSong.title || ""}
                  genre={currentSong.style || ""}
                  author={currentSong.userId || ""}
                  date={currentSong.created_at || ""}
                  isPlaying={isPlaying}
                  coverImage={currentSong.image_url || ""}
                  verses={currentSong.lyric || ""}
                />
              ) : (
                <p className="text-muted-foreground">Select a song to view lyrics</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
