import {
  LandingProductTourSection,
  LandingProductTourList,
  LandingProductTourTrigger,
  LandingProductTourContent,
} from "@/components/landing/LandingProductTour";
import { VideoPlayer } from "@/components/shared/VideoPlayer";

export default function Tour() {
  return (
    <>
      <LandingProductTourSection
        title="Landing page in minutes"
        description="Get 10x more done with Shadcn UI, React & Next.js, and say goodbye to repetitive tasks. You'll never go back."
        defaultValue="feature-1"
      >
        <LandingProductTourList>
          <LandingProductTourTrigger value="feature-1">
            <p className="text-xl font-bold">Automatic deployment to Vercel</p>
            <p>
              Deploying the generated template to Vercel is as easy as clicking
              a button.
            </p>
          </LandingProductTourTrigger>

          <LandingProductTourTrigger value="feature-2">
            <p className="text-xl font-bold">MDX blog, no server required</p>
            <p>Shipixen comes with a fully featured MDX blog.</p>
          </LandingProductTourTrigger>

          <LandingProductTourTrigger value="feature-3">
            <p className="text-xl font-bold">Customizable themes</p>
            <p>
              Choose from more than 30+ beautifully designed themes or create
              your own.
            </p>
          </LandingProductTourTrigger>
        </LandingProductTourList>
        <LandingProductTourContent value="feature-1">
          <VideoPlayer
            className={"w-full rounded-md"}
            src={"https://cache.shipixen.com/features/20-mobile-optimized.mp4"}
            autoPlay={true}
            controls={false}
            loop={true}
          />
        </LandingProductTourContent>
        <LandingProductTourContent value="feature-2">
          <VideoPlayer
            className={"w-full rounded-md"}
            src={
              "https://cache.shipixen.com/features/11-pricing-page-builder.mp4"
            }
            autoPlay={true}
            controls={false}
            loop={true}
          />
        </LandingProductTourContent>
        <LandingProductTourContent value="feature-3">
          <VideoPlayer
            className={"w-full rounded-md"}
            src={"https://cache.shipixen.com/features/21-run-locally.mp4"}
            autoPlay={true}
            controls={false}
            loop={true}
          />
        </LandingProductTourContent>
      </LandingProductTourSection>
    </>
  );
}
