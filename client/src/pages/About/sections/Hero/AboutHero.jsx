import React from "react";
import { motion } from "framer-motion";
import styles from "./AboutHero.module.css";

const AboutHero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <span className={styles.eyebrow}>Who We Are</span>
        <h1>Built by Engineers.<br />Driven by Real Problems.</h1>
        <p>
          Pandit Soft Solution is a small, focused software team from Bihar, India. We
          build web applications, AI tools, and digital platforms that work —
          without the overhead of an agency.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;