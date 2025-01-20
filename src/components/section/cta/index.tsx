import { LandingSaleCtaSection } from "@/components/landing/cta/LandingSaleCta";
import { Button } from "@/components/shared/ui/button";
import { LandingDiscount } from "@/components/landing/discount/LandingDiscount";

export default function CATs() {
  return (
    <>
      <LandingSaleCtaSection
        withBackground
        withBackgroundGlow
        title="Unleash Your Musical Genius"
        description="Transform Your Ideas into Professional Music with our AI Song Generator - Just one minute!"
      >
        <Button size="xl" asChild>
          <a href="/ai-song-generator">Start Creating Free</a>
        </Button>

        {/* <LandingDiscount
          className="w-full"
          discountValueText="$350 off"
          discountDescriptionText="for the first 10 customers (2 left)"
        /> */}
      </LandingSaleCtaSection>
    </>
  );
}
