import React from "react";
import AboutHero from "./sections/Hero/AboutHero";
import AboutStory from "./sections/Story/AboutStory";
import Values from "./sections/Values/Values";
import Vision from "./sections/Vision/Vision";
import AboutCTA from "./sections/CTA/AboutCTA";
import Owner from "./sections/Owner/Owner";

const About = () => {
  return (
    <>
      <AboutHero />
      {/* <Owner/> */}
      <AboutStory />
      <Values />
      <Vision />
      <AboutCTA />
    </>
  );
};

export default About;
