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

export default function Component() {
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
          <Playlist />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
          <div className="h-full bg-muted/50 rounded-xl p-4">
            <Lyrics
              title="Furry Friends"
              genre="playful, pop"
              author="JovialNocturnes0685"
              date="2024年12月2日 15:17"
              isPlaying={true}
              coverImage="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              verses={`[Verse]
                In the morning light they wake me
                Tiny paws a gentle plea
                We chase the sun and greet the day
                With a wag and a playful tray

                In the morning light they wake me
                Tiny paws a gentle plea
                We chase the sun and greet the day
                With a wag and a playful tray

                [Verse 2]
                In the park we run carefree
                Tongues out grinning wide and free
                Find a stick and make it fly
                Catch it right up in the sky

                [Chorus]
                They bark they purr they meow
                Furry friends forever now
                Through the highs and through the lows
                By our side love always shows

                In the morning light they wake me
                Tiny paws a gentle plea
                We chase the sun and greet the day
                With a wag and a playful tray

                [Verse 2]
                In the park we run carefree
                Tongues out grinning wide and free
                Find a stick and make it fly
                Catch it right up in the sky

                [Chorus]
                They bark they purr they meow
                Furry friends forever now
                Through the highs and through the lows
                By our side love always shows

                In the morning light they wake me
                Tiny paws a gentle plea
                We chase the sun and greet the day
                With a wag and a playful tray

                [Verse 2]
                In the park we run carefree
                Tongues out grinning wide and free
                Find a stick and make it fly
                Catch it right up in the sky

                [Chorus]
                They bark they purr they meow
                Furry friends forever now
                Through the highs and through the lows
                By our side love always shows

                [Verse 2]
                In the park we run carefree
                Tongues out grinning wide and free
                Find a stick and make it fly
                Catch it right up in the sky

                [Chorus]
                They bark they purr they meow
                Furry friends forever now
                Through the highs and through the lows
                By our side love always shows`}
                />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* <div className="sm:w-[400px] flex-shrink-0 bg-muted/50 rounded-xl p-4">
        <Playlist />
      </div> */}
    </div>
  );
}
