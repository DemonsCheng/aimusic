import { SparklesIcon, LineChartIcon, LayersIcon } from "lucide-react";
import { LandingFeatureList } from "@/components/landing/feature/LandingFeatureList";

const featureItems = [
  {
    title: "Automatic deployment to Vercel",
    description:
      "Deploying the generated template to Vercel is as easy as clicking a button. ",
    icon: <SparklesIcon />,
  },
  {
    title: "Dynamic Social Image",
    description:
      "We generate an open graph image that will be visible when you share your site online.",
    icon: <LineChartIcon />,
  },
  {
    title: "MDX blog, no server required",
    description: "Shipixen comes with a fully featured MDX blog. ",
    icon: <LayersIcon />,
  },
];

export default function Features() {
  return (
    <div className=" mx-auto ">
      <LandingFeatureList
        withBackgroundGlow
        // backgroundGlowVariant="primary"
        // variant="secondary"
        title={"Nothing quite like it."}
        description={
          "Shipixen sets up everything you need to start working on your blog, website or product."
        }
        featureItems={featureItems}
      />
    </div>
  );
}
