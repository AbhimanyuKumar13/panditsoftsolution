import React from "react";
import { motion } from "framer-motion";
import styles from "./ContactHero.module.css";

const ContactHero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <h1>Contact Us</h1>
        <p>
          Tell us about your project. We’ll respond within 24 hours with clarity, not confusion.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactHero;
