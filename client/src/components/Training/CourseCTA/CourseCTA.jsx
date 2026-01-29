import React from "react";
import styles from "./CourseCTA.module.css";
import { motion } from "framer-motion";

const {
    VITE_WHATSAPP_NUMBER,
    VITE_WHATSAPP_DEFAULT_MESSAGE_SKILL_LAB,
  } = import.meta.env;

  

const CourseCTA = () => {
  const whatsappLink = `https://wa.me/${VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    VITE_WHATSAPP_DEFAULT_MESSAGE_SKILL_LAB
  )}`;

  return (
    <motion.section 
      className={styles.cta} 
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2>Let’s Start Your Journey with PanditSoftSolution.</h2>
      <p>Connect to Our HR Team.</p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
      >
        Message on WhatsApp
      </a>
    </motion.section>
  );
};

export default CourseCTA;
