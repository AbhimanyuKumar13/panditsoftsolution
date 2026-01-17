import React from "react";
import ProjectsHero from "./sections/Hero/ProjectsHero";
import ProjectsList from "./sections/List/ProjectsList";
import Approach from "./sections/Approach/Approach";
import ProjectsCTA from "./sections/CTA/ProjectsCTA";

const Projects = () => {
  return (
    <>
      <ProjectsHero />
      <ProjectsList />
      <Approach />
      <ProjectsCTA />
    </>
  );
};

export default Projects;
