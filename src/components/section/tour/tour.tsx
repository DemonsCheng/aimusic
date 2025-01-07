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
        title="How to Use AI Song Generator"
        description="Effortless to use, fast to create—AI Song Generator brings your musical ideas to life!"
        defaultValue="feature-1"
      >
        <LandingProductTourList>
          <LandingProductTourTrigger value="feature-1">
            <p className="text-xl font-bold">Get Started Quickly</p>
            <p>
              Choose a Song Style: Select your preferred genre, such as pop,
              rock, or electronic.
            </p>
            <p>
              Input Your Ideas: Provide lyrics, keywords, or short phrases, and
              the AI will create melodies based on your input.
            </p>
          </LandingProductTourTrigger>

          <LandingProductTourTrigger value="feature-2">
            <p className="text-xl font-bold">Personalize Your Song</p>
            <p>
              Adjust Tempo and Mood: Choose the pace and emotional tone (e.g.,
              happy, sad, or energetic).
            </p>
            <p>Customize Lyrics: Edit the lyrics to suit your taste.</p>
            <p>
              Refine Your Song: Generate and tweak multiple times until you're
              satisfied with the result.
            </p>
          </LandingProductTourTrigger>

          <LandingProductTourTrigger value="feature-3">
            <p className="text-xl font-bold">Save and Share</p>
            <p>
              Download Your Music: Export your song as a high-quality audio file
            </p>
            <p>
              Share Your Creation: Publish directly to social media and share
              your music with friends and fans.
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
