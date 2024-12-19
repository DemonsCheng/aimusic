"use client";
import { GalleryVerticalEnd, Minus, Plus, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MusicForm from "./_components/gen-music-form";
import Playlist from "../playlist/page";
import { Lyrics } from "@/components/shared/Lyrics";
import { SelectMusic } from "@/lib/db/schema";
import { useState } from 'react';
import { cn } from "@/lib/utils";

export default function Component() {
  const [currentSong, setCurrentSong] = useState<SelectMusic | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 pt-0 min-h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={35} minSize={20} maxSize={30}>
          <div className="h-full bg-muted/50 rounded-xl p-4">
            <MusicForm />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} maxSize={60} minSize={40}>
          <div className="h-full bg-muted/50 rounded-xl p-4">
            <Playlist 
              onSongSelect={setCurrentSong} 
              onPlayingChange={setIsPlaying}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={15} maxSize={20}>
          <div className={cn(
            "h-full  rounded-xl p-2",
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
              <div className="text-center text-muted-foreground">
                <p>Select a song to view lyrics</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}