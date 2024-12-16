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

export default function Component() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 pt-0 min-h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={33} minSize={20}>
          <div className="h-full bg-muted/50 rounded-xl p-4">
            <MusicForm />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={67} minSize={30}>
          <div className="h-full bg-muted/50 rounded-xl p-4">
            <MusicForm />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="sm:w-[400px] flex-shrink-0 bg-muted/50 rounded-xl p-4">
        <Playlist />
      </div>
    </div>
  );
}
