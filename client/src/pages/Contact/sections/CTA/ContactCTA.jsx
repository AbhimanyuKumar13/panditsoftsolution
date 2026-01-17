import React from "react";
import styles from "./ContactCTA.module.css";
import { motion } from "framer-motion";

const ContactCTA = () => {
  const {
    VITE_WHATSAPP_NUMBER,
    VITE_WHATSAPP_DEFAULT_MESSAGE,
  } = import.meta.env;

  const whatsappLink = `https://wa.me/${VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    VITE_WHATSAPP_DEFAULT_MESSAGE
  )}`;

  return (
    <motion.section
      className={styles.cta}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2>Let’s build something solid.</h2>
      <p>Chat directly with us on WhatsApp — no forms, no waiting.</p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
      >
        Chat on WhatsApp
      </a>
    </motion.section>
  );
};

export default ContactCTA;
