import React from "react";
import { motion } from "framer-motion";
import styles from "./AboutStory.module.css";

const AboutStory = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.box}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2>Our Story</h2>
        <p>
          PanditSoftSolution was created with a simple goal — to build reliable
          software without shortcuts. We focus on clean architecture, clear
          communication, and long-term value rather than quick fixes.
        </p>
        <p>
          We work closely with clients to understand real business problems and
          translate them into scalable digital solutions.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutStory;
