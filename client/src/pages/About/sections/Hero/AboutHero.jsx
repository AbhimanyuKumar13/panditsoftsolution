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
        <h1>About Pandit Soft Solution</h1>
        <p>
          We build software with clarity, responsibility, and long-term thinking.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;
