import React from "react";
import Hero from "./sections/Hero/Hero";
import Services from "./sections/Services/Services";
import WhyUs from "./sections/WhyUs/WhyUs";
import Work from "./sections/Work/Work";
import CTA from "./sections/CTA/CTA";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Work />
      <CTA />
    </>
  );
};

export default Home;
