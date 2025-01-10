import {
  SparklesIcon,
  Gamepad2,
  TrendingUp,
  Film ,
  GraduationCap,
  Music2,
} from "lucide-react";
import { LandingFeatureList } from "@/components/landing/feature/LandingFeatureList";

const featureItems = [
  {
    title: "Content Creator's Assistant",
    description:
      "Music is no longer a creative bottleneck, but a source of inspiration.Professional music solutions for video creators, podcasters, and streamers. Generate perfect soundtracks instantly to make your content more engaging.",
    icon: <SparklesIcon />,
  },
  {
    title: "Game Developer's Companion",
    description:
      "Dynamic music that evolves with gameplay.Real-time music generation engine for game developers to create immersive gaming experiences. From character themes to combat scores, seamlessly integrated.",
    icon: <Gamepad2 />,
  },
  {
    title: "Marketing Success Catalyst",
    description:
      "Give your brand a distinctive voice.Transform brand messaging through customized music. Perfect for social media, product launches, and marketing campaigns with precise emotional targeting.",
    icon: <TrendingUp />,
  },
  {
    title: "Film & TV Production Suite",
    description:
      "Perfect music for every scene.Professional scoring tools for visual storytelling. Smart scene recognition and style customization for films, TV shows, and commercials.",
    icon: <Film  />,
  },
  {
    title: "Educational Innovation Tool",
    description:
      "Making music education more engaging.Transform music learning through interactive visualization and practical exercises. Perfect for classrooms, online courses, and self-learning.",
    icon: <GraduationCap  />,
  },
  {
    title: "Personal Music Studio",
    description:
      "Everyone can be a music creator.Zero-barrier music creation system for personal expression. Turn your ideas into professional tracks with AI-powered composition tools. ",
    icon: <Music2  />,
  },
];

export default function UseCase() {
  return (
    <LandingFeatureList
      title={"Unleash Unlimited Musical Possibilities"}
      description={"Let AI Song Generator Be Your Creative Partner."}
      featureItems={featureItems}
    />
  );
}
