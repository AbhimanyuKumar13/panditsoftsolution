import React from "react";
import ContactHero from "./sections/Hero/ContactHero";
import ContactInfo from "./sections/Info/ContactInfo";
import ContactForm from "./sections/Form/ContactForm";
import ContactCTA from "./sections/CTA/ContactCTA";

const Contact = () => {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactCTA />
    </>
  );
};

export default Contact;
