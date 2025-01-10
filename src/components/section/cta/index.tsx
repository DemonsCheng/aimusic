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
        description="Pre-order today and get a 50% discount on the final price for the first 3 months. No credit card required."
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
