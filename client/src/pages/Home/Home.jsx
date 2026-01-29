import React from "react";
import Hero from "./sections/Hero/Hero";
import Services from "./sections/Services/Services";
import WhyUs from "./sections/WhyUs/WhyUs";
import Work from "./sections/Work/Work";
import CTA from "./sections/CTA/CTA";
import Stats from "./sections/Stats/Stats";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Work />
      <Stats/>
      <CTA />
    </>
  );
};

export default Home;
