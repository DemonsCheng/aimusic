import { SparklesIcon, Music, Infinity  } from "lucide-react";
import { LandingFeatureList } from "@/components/landing/feature/LandingFeatureList";

const featureItems = [
  {
    title: "Instant Professional Creation",
    description:
      "Transform your ideas into studio-quality music in seconds, with advanced AI technology that delivers professional-grade compositions across any genre or style. ",
    icon: <SparklesIcon />,
  },
  {
    title: "Universal Music Access",
    description:
      "Create without limits - no musical training required. Our intuitive platform empowers everyone to compose, whether you're a beginner or professional musician.",
    icon: <Music />,
  },
  {
    title: "Creative Freedom Guarantee",
    description:
      "Full creative control with customization options, and 100% royalty-free music that's yours to own and use commercially. ",
    icon: <Infinity  />,
  },
];

export default function Features() {
  return (
    <div className=" mx-auto ">
      <LandingFeatureList
        withBackgroundGlow
        backgroundGlowVariant="primary"
        variant="primary"
        title={"Why Choose Our AI Song Generator"}
        description={"Where Innovation Meets Musical Excellence"}
        featureItems={featureItems}
      />
    </div>
  );
}
