import React from "react";
import ServicesHero from "./sections/Hero/ServicesHero";
import ServicesList from "./sections/List/ServicesList";
import Process from "./sections/Process/Process";
import TechStack from "./sections/Tech/TechStack";
import ServicesCTA from "./sections/CTA/ServicesCTA";

const Services = () => {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <Process />
      <TechStack />
      <ServicesCTA />
    </>
  );
};

export default Services;
