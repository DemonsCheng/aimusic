import { Button } from "@/components/shared/ui/button";
import { LandingPrimaryImageCtaSection } from "@/components/landing/cta/LandingPrimaryCta";
import { LandingDiscount } from "@/components/landing/discount/LandingDiscount";
import { LandingProductHuntAward } from "@/components/landing/social-proof/LandingProductHuntAward";
import { LandingSocialProof } from "@/components/landing/social-proof/LandingSocialProof";
import { LandingSocialProofBand } from "@/components/landing/social-proof/LandingSocialProofBand";
import { LandingSocialProofBandItem } from "@/components/landing/social-proof/LandingSocialProofBandItem";

export default function Hero() {
  return (
    <>
      <LandingPrimaryImageCtaSection
        title="AI Song Generator"
        description="Transform Your Ideas into Professional Music with our AI Song Generator - Just Pure Creativity"
        imageSrc="/static/images/shipixen/product/1.webp"
        imageAlt="Sample image"
        withBackground
        withBackgroundGlow
        // leadingComponent={<LandingProductHuntAward />}
      >
        <Button size="xl" asChild>
          <a href="#">Try now</a>
        </Button>

        {/* <Button size="xl" variant="outlinePrimary">
          <a href="#">Read more</a>
        </Button> */}

        <LandingSocialProof
          className="w-full mt-12"
          showRating
          numberOfUsers={99}
          avatarItems={[
            {
              imageSrc: "/static/images/people/1.webp",
              name: "John Doe",
            },
            {
              imageSrc: "/static/images/people/2.webp",
              name: "Jane Doe",
            },
            {
              imageSrc: "/static/images/people/3.webp",
              name: "Alice Doe",
            },
          ]}
        />
      </LandingPrimaryImageCtaSection>
    </>
  );
}
