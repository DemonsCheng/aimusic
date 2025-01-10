import Hero from "@/components/section/Hero";
import Features from "@/components/section/feature";
import CTA from "@/components/section/cta";
import FAQs from "@/components/section/faqs";
import Testimonials from "@/components/section/testimonials";
// import Footer from "@/components/section/footer";
// import Header from "@/components/section/header";
import Pricing from "@/components/section/pricing";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Tour from "@/components/section/tour/tour";
import UseCase from "@/components/landing/usecase/UseCase";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      {/* <div className="w-full max-w-4xl flex flex-col justify-between items-center font-sans mx-auto"> */}
      <Header />
      {/* </div> */}

      <Hero />
      <Features />
      <Tour />

      <UseCase />
      <div id="pricing">
       <Pricing />
      </div>
      <Testimonials />
      <FAQs />
      <CTA />
      <Footer />
    </>
  );
}
