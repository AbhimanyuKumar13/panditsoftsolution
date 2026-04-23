import React from "react";
import Hero from "./sections/Hero/Hero"; 
import WhyUs from "./sections/WhyUs/WhyUs";
import WorkOffer from "./sections/WorkOffer/WorkOffer";
import CTA from "./sections/CTA/CTA";
import Stats from "./sections/Stats/Stats";
import Offer from "./sections/Offer/Offer";

const Home = () => {
  return (
    <>
      <Offer/>
      <Hero /> 
      <WhyUs />
      <WorkOffer />
      <Stats/>
      <CTA />
    </>
  );
};

export default Home;
// 