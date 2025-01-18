import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MusicPlayerWrapper } from "@/components/music-player-wrapper";
import { MusicPlayer } from "@/components/music-player";
import { useMusicStore } from "@/store/music-store";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <Providers>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
        <MusicPlayerWrapper />
      </SidebarProvider>
    </Providers>
  );
}

// Client component for music player to avoid hydration issues
function ClientMusicPlayer() {
  "use client";

  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } =
    useMusicStore();

  const handleClose = () => {
    setCurrentSong(undefined);
    setIsPlaying(false);
  };

  if (!currentSong) return null;

  return (
    <MusicPlayer
      currentSong={currentSong}
      onClose={handleClose}
      isPlaying={isPlaying}
      onPlayPause={setIsPlaying}
    />
  );
}
