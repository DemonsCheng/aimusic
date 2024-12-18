"use server";
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistItem } from "./_components/playlist-item";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
}

// const songs: Song[] = [
//   {
//     id: 1,
//     title: "Big Energy",
//     artist: "Latto",
//     duration: "02:03",
//     coverUrl: "https://example.com/cover1.jpg"
//   },
//   {
//     id: 2,
//     title: "SNAP",
//     artist: "Rosa Linn",
//     duration: "02:59",
//     coverUrl: "https://example.com/cover2.jpg"
//   },
//   {
//     id: 3,
//     title: "Easy On Me",
//     artist: "Adele",
//     duration: "03:44",
//     coverUrl: "https://example.com/cover3.jpg"
//   },
//   {
//     id: 4,
//     title: "KU LO SA",
//     artist: "Oxlade",
//     duration: "02:28",
//     coverUrl: "https://example.com/cover4.jpg"
//   },
//   {
//     id: 5,
//     title: "Poison",
//     artist: "Bell, Biv, DeVoe",
//     duration: "03:54",
//     coverUrl: "https://example.com/cover5.jpg"
//   }
// ];



export default async  function Playlist() {
  const response = await fetch("https://localhost:3000/api/music", {
    method: "GET",
  });
  // if (!response.d) {
  //   throw new Error("Failed to fetch data");

  // }
  const {data, code} = await response.json();
    console.log("code", code);
    console.log("data", data);
  if (code !== 1) {
    console.log("Failed to fetch data");
  }
  console.log("data", data);
  const songs = data.map((song: Song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    coverUrl: song.coverUrl
  }));

  return (
    <div className="h-screen w-full bg-gradient-to-r p-6">
      <div className="max-w-md">
        <h2 className="text-xl font-bold mb-4">PlayList</h2>
        
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="space-y-4">
            {songs.map((song: Song) => (
              <PlaylistItem key={song.id} song={song} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
